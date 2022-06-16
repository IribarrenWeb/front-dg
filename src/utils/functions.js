import { filter, forEach, includes, isArray, isEmpty, isEqual, isObject, keys, transform } from "lodash";
import schemasRepo from "../schemas";
// function validateData(data, key, toIncludes = [], toExcludes = []) {
//     if (!empty(toExcludes) && includes(toExcludes, key)) {
//         return false
//     }
//     if ((!empty(toIncludes) && !includes(toIncludes, key))
//         || (isNumber(data) && data >= 1)
//         || isBoolean(data)
//         || (!isEmpty(data) && !isNull(data))) {
//         console.log('include', key, data);
//         return true;
//     } else {
//         console.log('notinclude', key, data);
//         return false;
//     }
// }
function cleanData(model, excludes = [], includes = [], formData = false) {
    let data = pruneData(copy(model), excludes, includes);
    if (formData) {
        data = toFormData(data);
    }
    return data
}
function toFormData(data) {
    const dataForm = new FormData
    const keysData = keys(data)
    forEach(keysData, (k) => {
        dataForm.append(k, data[k])
    })
    return dataForm
}
function pruneData(object, excludes = []) {
    Object
        .entries(object)
        .forEach(([k, v]) => {
            if (v && typeof v === 'object')
                pruneData(v);
            if (v &&
                typeof v === 'object' &&
                !Object.keys(v).length ||
                v === null ||
                v === undefined ||
                v.length === 0
            ) {
                if (Array.isArray(object))
                    object.splice(k, 1);
                else if (includes(excludes))
                    delete object[k];
                else
                    delete object[k]
            }
        });
    return object;
}
function copy(data) {
    return JSON.parse(JSON.stringify(data))
}
function rolename(role) {
    switch (role) {
        case 1:
            role = 'admin';
            break;
        case 2:
            role = 'delegate';
            break;
        case 3:
            role = 'auditor';
            break;
        case 4:
            role = 'business';
            break;

        default:
            role = false
            break;
    }
    return role;
}
function pluck(arr, key) {
    return arr.map(i => i[key]);
}
function filterDoc(arr, doc_name) {
    return filter(arr, function (o) { return o.type.name == doc_name })[0]
}
function difference(obj, newObj) {
    return changes(obj, newObj)
}
function changes(obj, newObj) {
    let arrayIndexCounter = 0
    return transform(newObj, function (result, value, key) {
        if (!isEqual(value, obj[key])) {
            let resultKey = isArray(obj) ? arrayIndexCounter++ : key
            result[resultKey] = (isObject(value) && isObject(obj[key])) ? changes(obj[key],value) : value
        }
    })
}
function empty(data) {
    return isEmpty(data)
}
function setSatus(status) {
    let type = "";
    switch (status) {
        case "PENDIENTE":
            type = "danger";
            break;
        case "POR REVISAR":
            type = "warning";
            break;
        case "COMPLETADO":
            type = "success";
            break;

        default:
            break;
    }
    return type;
}
function schemas(type) {
    return copy(schemasRepo[type]) ?? null
}
async function compressImage(imgToCompress, resizingFactor = 0.8, quality = 0.6) {
    return new Promise((resolve) => {
        // showing the compressed image
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const originalWidth = imgToCompress.width;
        const originalHeight = imgToCompress.height;
        console.log(originalHeight, originalWidth);
        if (originalWidth >= 700) {
            resizingFactor = 0.5
        }
        const canvasWidth = originalWidth * resizingFactor;
        const canvasHeight = originalHeight * resizingFactor;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.drawImage(
            imgToCompress,
            0,
            0,
            originalWidth * resizingFactor,
            originalHeight * resizingFactor
        );

        // reducing the quality of the image
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    // let compressedImageBlob = blob;
                    resolve(blob)
                    // let src = URL.createObjectURL(compressedImageBlob);
                }
            },
            "image/jpeg",
            quality
        )
    })
}
function formatDate(date, format = "en-US") {
    return new Date(date).toLocaleDateString(format);
}
function formatDoc(b64) {
    var byteCharacters = atob(b64);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], {
        type: "application/pdf;base64",
    });
    var fileURL = URL.createObjectURL(file);
    return fileURL;
}
export default {
    copy,
    rolename,
    pluck,
    filterDoc,
    difference,
    empty,
    setSatus,
    schemas,
    compressImage,
    formatDate,
    formatDoc,
    cleanData,
    toFormData
}
