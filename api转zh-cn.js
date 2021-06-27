const fs = require('fs-extra');
// let v1 = null;
// let v3 = null;

/** 检测是否为中文，true表示是中文，false表示非中文 */
function isChinese(str){
    return /[\u3220-\uFA29]+/.test(str)
}
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

function find(apiData,keys,api_old) {
    const zh_cn = api_old.zhcn
    const de_sc = api_old.desc
    if (keys[0]==='Constants') {
        let Constants = apiData[keys[0]]
        if(!Constants[keys[1]]) return; 
        for(const api of Constants[keys[1]]){
            if(api.name == keys[2]&&isChinese(api.desc)){
                if(zh_cn&&api.desc!=zh_cn){
                    console.log([api.desc,zh_cn],keys)
                }
                return api.desc
            }
        }
        return;
    }
    if(!apiData[keys[0]]) return;
    for(const api of apiData[keys[0]]){
        if(api.name == keys[1]&&isChinese(api.desc)){
            if(zh_cn&&api.desc!=zh_cn){
                console.log([api.desc,zh_cn],keys)
            }
            return api.desc
        }
    }
}

function transform(arr_a,arr_b) {
    let arr_r = {}
    for(const className in arr_a){
        if (className==='Constants'){
            const data = arr_a[className]
            let Constants = arr_r[className] = {};
            for(const constantName in data){
                Constants[constantName] = {__self:''};
                data[constantName].forEach(
                    api=>Constants[constantName][api.name] =api.zhcn || ''
                    )
            }
            continue
        }
        arr_r[className] = {__self:'',__extends:'',__globalAccessorVariable:''};
        arr_a[className].forEach(
            api=>arr_r[className][api.name] =api.zhcn || ''
            )
    }
    return arr_r
}

['js','lua_server','lua_client'].forEach(
    ele=>{
        var arr_a = `media/api_${ele}.json`;
        var arr_b = `media/api_${ele} - 副本.json`;
        var arr_c = `media/i18n/${ele}_zh-cn.json`;
        // if (!fs.existsSync(arr_b)) return;
        // let tararr = check(arr_a,arr_b,{},[]);
        let tararr = transform(require('./'+arr_a));//,require('./'+arr_b)
        console.log(`完成 打印如下`);
        fs.writeFileSync(arr_c,JSON.stringify(tararr))
    }
)