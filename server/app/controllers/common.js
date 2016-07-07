/***公共js模块方法****/

var _CONFIG = require('../../config/config');
var _FUNCTION = require('../../lib/function');
var fs = require("fs");
var mime = require('mime');
var ALY = require('aliyun-sdk-js');

//文件上传统一入口
exports.upload = function(req, res) {
    var imgData = req.body.baseStrImage;
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, ""); //过滤data:URL
    var dataBuffer = new Buffer(base64Data, 'base64');
    var fileName = _FUNCTION.getRandPicName() + '.png';
    var path = _CONFIG.upload.dir;
    fs.writeFile(path + fileName, dataBuffer, function(err) {
        if (err) {
            console.log('图片上传错误:' + err);
            res.json({
                status: 0,
                code: 0,
                msg: '上传失败' + err
            });
            return;
        }
        console.log('上传到本地的图片为：'+fileName);
        oss_upload(fileName, path); //调用OSS存储
        res.json({
            status: 1,
            code: 200,
            msg: '上传成功',
            data: fileName,
        });
    });
}

//阿里云分片上传存储
var oss_upload = function(fileName, filePath) {
            console.log('上传到阿里云：'+fileName);

    // Upload options
    var bucket = _CONFIG.aliyunOSS.bucket;
    var oss = new ALY.OSS(_CONFIG.aliyunOSS);

    var fileKey = fileName;
    var buffer = fs.readFileSync(filePath + fileName);
    // Upload
    var startTime = new Date();
    var partNum = 0;
    var partSize = 1024 * 1024 * 5; // Minimum 5MB per chunk (except the last part)
    var numPartsLeft = Math.ceil(buffer.length / partSize);
    var maxUploadTries = 3;

    var multipartMap = {
        Parts: []
    };

    function completeMultipartUpload(oss, doneParams) {
        oss.completeMultipartUpload(doneParams, function(err, data) {
            if (err) {
                console.log("An error occurred while completing the multipart upload");
                console.log(err);
            } else {
                var delta = (new Date() - startTime) / 1000;
                console.log('Completed upload in', delta, 'seconds');
                console.log('Final upload data:', data);
            }
        });
    }

    function uploadPart(oss, multipart, partParams, tryNum) {
        var tryNum = tryNum || 1;
        oss.uploadPart(partParams, function(multiErr, mData) {
            if (multiErr) {
                console.log('multiErr, upload part error:', multiErr);
                if (tryNum < maxUploadTries) {
                    console.log('Retrying upload of part: #', partParams.PartNumber)
                    uploadPart(oss, multipart, partParams, tryNum + 1);
                } else {
                    console.log('Failed uploading part: #', partParams.PartNumber)
                }
                return;
            }
            multipartMap.Parts[this.request.params.PartNumber - 1] = {
                ETag: mData.ETag,
                PartNumber: Number(this.request.params.PartNumber)
            };
            console.log("Completed part", this.request.params.PartNumber);
            console.log('mData', mData);
            if (--numPartsLeft > 0) return; // complete only when all parts uploaded

            var doneParams = {
                Bucket: bucket,
                Key: fileKey,
                CompleteMultipartUpload: multipartMap,
                UploadId: multipart.UploadId
            };

            console.log("Completing upload...");
            completeMultipartUpload(oss, doneParams);
        });
    }

    // Multipart
    console.log("Creating multipart upload for:", fileKey + ' --->path:' + filePath);
    var cType = mime.lookup(filePath + fileName);
    oss.createMultipartUpload({
        ACL: 'public-read',
        Bucket: bucket,
        Key: fileKey,
        ContentType: cType,
        ContentDisposition: ''
            //CacheControl: '',
            //ContentEncoding: '',
            //Expires: '',
            //ServerSideEncryption: ''
    }, function(mpErr, multipart) {
        if (mpErr) {
            console.log('Error!', mpErr);
            return;
        }
        console.log("Got upload ID", multipart.UploadId);

        // Grab each partSize chunk and upload it as a part
        for (var rangeStart = 0; rangeStart < buffer.length; rangeStart += partSize) {
            partNum++;
            var end = Math.min(rangeStart + partSize, buffer.length),
                partParams = {
                    Body: buffer.slice(rangeStart, end),
                    Bucket: bucket,
                    Key: fileKey,
                    PartNumber: String(partNum),
                    UploadId: multipart.UploadId
                };

            // Send a single part
            console.log('Uploading part: #', partParams.PartNumber, ', Range start:', rangeStart);
            uploadPart(oss, multipart, partParams);
        }
    });


}