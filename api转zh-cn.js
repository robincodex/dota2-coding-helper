
const fs = require('fs-extra');
let v1 = null;
let v2 = null;

/**
 * 把传入的对象转化为拼接起来的字符串
 */
function Msg(arr){
    let str = '';
    let type = arr.constructor
    if (type==Number||type==String) return arr;
    if (type==Array)return arr.join();
    for(let i in arr){
        str += `${i}=> `
        if (typeof(arr[i])=='object'){
            str += Msg(arr[i])
        }else{
            str += `${arr[i]}, `
        }
    }
    return str
}

/**
 * 检测及复制
 * @param {object} _tar1 复制来源
 * @param {object} _tar2 被覆盖的对象
 * @param {Array} dir 路径的深度
 * @returns {object} 覆盖后的参数2
 */
function check(_tar1,_tar2,dir) {
    for (let i in _tar1){
        
        v1 = _tar1[i];
        v2 = _tar2[i];
        
        let type = v1.constructor ;
        if(type == Number||type == String){
            if (v2==null||v2==undefined||v1==v2||i=='func'||i=='return') {
                _tar2[i]=v1;
            } else if ( i=='desc' ) {
                _tar2[i]=v2;
            } else {
                console.log(type,dir,`\n键 => ${i}\n值 => ${Msg(v1)} \n   => ${Msg(v2)}`);
            }

        }else{
            let _dir = [];
            // dir.forEach(element =>_dir.push(element));
            _dir.push(i);


            if (v2==null||v2==undefined){
                v2=type ==Array? []:{}
            }

            if (type ==Object){
                for(let s in _tar2){
                    if(_tar2[s].name === v1.name){
                        v2 = _tar2[s]
                        break
                    }
                }
                if(v2.name!=v1.name){
                    v2=type ==Array? []:{}
                }
            }
            // else if (type==Array){
            //     console.log(dir,type,i in _tar2,i,v2==null||v2==undefined)
            // }

            _tar2[i]=check(v1,v2,type ==Array? []:{},_dir);
        }
    }
    return _tar2;
}



const arr_en = require('./media/lua_api_client_en.json');
const arr_cn = require('./media/lua_api_client_zh-cn.json');
const tar = 'media/lua_api_client_zh-cn.json';
let tararr = {};
tararr = check(arr_cn, {},[]);
tararr = check(arr_en, tararr,[]);
console.log(`完成 打印如下`);

let parenti = tar.lastIndexOf('/');
let out_dir = tar.substr(0, parenti);
if (!fs.existsSync(out_dir)) fs.mkdirSync(out_dir);
fs.writeFileSync(tar,JSON.stringify(tararr))
// console.log(tararr);