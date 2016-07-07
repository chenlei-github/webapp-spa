/**
 *@param n: 要生成的整数的位数
 *@return 返回长度为n位的随机整数
 */
function getRandomN(n){
    var rnd="", r;
    //每次生成0~9之间的1位数字,累加成多位字符串
    for(var i=0;i<n;i++){
        r = Math.random()*10;
        if(i==0){
            //0<首位<10
            if(r<9){
                rnd += Math.floor(r+1);
            }
        }else{
            rnd += Math.floor(r);
        }
    }
    return parseInt(rnd);
}

/**
 *@param n: 要生成的字符串长度
 *@return 长度为n的随机字符串
 */
function getRandomString(len) {
　　len = len || 32; 
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

function getTime(){
    var today=new Date();
    var m=(today.getMonth()+1).toString();
    var d=(today.getDate()).toString();
    var h=(today.getHours()).toString();
    var i=(today.getMinutes()).toString();
    var s=(today.getSeconds()).toString();
    return m+d+h+i+s;
}

function getRandPicName(){
    return getRandomString(8)+getTime();
}

exports.getRandomN = getRandomN;
exports.getRandomString = getRandomString;
exports.getTime = getTime;
exports.getRandPicName = getRandPicName;
