
import code2readable from "./tags" 

export function parse(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;

            const dataView = new DataView(arrayBuffer);
            for (let i = 0; i < dataView.byteLength - 2; i++) {
                // Search marker APP13
                if (dataView.getUint8(i) === 0xFF && dataView.getUint8(i + 1) === 0xED) {
                    const app13Data = new Uint8Array(arrayBuffer.slice(i + 2));

                    const photoshopTags = extractPhotoshopTags(app13Data);

                    if (photoshopTags) {
                        resolve(photoshopTags);
                    } else {
                        console.warn("No photoshpo exif tags found.");
                        resolve({});
                    }
                    break;
                }
            }
            console.warn("No photoshpo exif tags found.");
            resolve({});
        };
        reader.onerror = () => reject(`Error occurred reading file: ${file.name}`);
        reader.readAsArrayBuffer(file);
    });
}

function extractPhotoshopTags(app13Data) {
    const photoshopTags = {};
    const marker = new Uint8Array([0x38, 0x42, 0x49, 0x4D]); // "8BIM"

    let i = 0;
    const dataLength = app13Data.length;

    /* scan through resource blocks:
    *Format: 0) Type, 4 bytes - '8BIM' (or the rare 'PHUT', 'DCSR', 'AgHg' or 'MeSa')
    *        1) TagID,2 bytes
    *        2) Name, pascal string padded to even no. bytes
    *        3) Size, 4 bytes - N
    *        4) Data, N bytes
    */
    while (i < dataLength) {
        if (
            app13Data[i] === marker[0] &&
            app13Data[i + 1] === marker[1] &&
            app13Data[i + 2] === marker[2] &&
            app13Data[i + 3] === marker[3]
        ) {
            const code = (app13Data[i + 4] << 8) | app13Data[i + 5];
            const nameLength = app13Data[i + 6];
            const name = String.fromCharCode.apply(null, app13Data.subarray(i + 7, i + 7 + nameLength));
            const length = (app13Data[i + 8 + nameLength] << 24) | (app13Data[i + 9 + nameLength] << 16) | (app13Data[i + 10 + nameLength] << 8) | app13Data[i + 11 + nameLength];
            const rawTagData = app13Data.slice(i + 12 + nameLength, i + 12 + nameLength + length);

            const readableData = code2readable[code];
            const codeName = readableData && readableData.name || code;
            const tagData = readableData && readableData.parser && readableData.parser(rawTagData) || rawTagData;

            photoshopTags[codeName] = tagData;

            i += 11 + nameLength + length;
        } else {
            i++;
        }
    }

    return photoshopTags;
}
