
// Thanks to https://exiftool.org/TagNames/Photoshop.html
const code2string = {
    0x03e8: "Photoshop2Info",
    0x03e9: "MacintoshPrintInfo",
    0x03ea: "XMLData",
    0x03eb: "Photoshop2ColorTable",
    0x03ed: "ResolutionInfo",
    0x03ee: "AlphaChannelsNames",
    0x03ef: "DisplayInfo",
    0x03f0: "PStringCaption",
    0x03f1: "BorderInformation",
    0x03f2: "BackgroundColor",
    0x03f3: "PrintFlags",
    0x03f4: "BW_HalftoningInfo",
    0x03f5: "ColorHalftoningInfo",
    0x03f6: "DuotoneHalftoningInfo",
    0x03f7: "BW_TransferFunc",
    0x03f8: "ColorTransferFuncs",
    0x03f9: "DuotoneTransferFuncs",
    0x03fa: "DuotoneImageInfo",
    0x03fb: "EffectiveBW",
    0x03fc: "ObsoletePhotoshopTag1",
    0x03fd: "EPSOptions",
    0x03fe: "QuickMaskInfo",
    0x03ff: "ObsoletePhotoshopTag2",
    0x0400: "TargetLayerID",
    0x0401: "WorkingPath",
    0x0402: "LayersGroupInfo",
    0x0403: "ObsoletePhotoshopTag3",
    0x0404: "IPTCData",
    0x0405: "RawImageMode",
    0x0406: "JPEG_Quality",
    0x0408: "GridGuidesInfo",
    0x0409: "PhotoshopBGRThumbnail",
    0x040a: "CopyrightFlag",
    0x040b: "URL",
    0x040c: "PhotoshopThumbnail",
    0x040d: "GlobalAngle",
    0x040e: "ColorSamplersResource",
    0x040f: "ICC_Profile",
    0x0410: "Watermark",
    0x0411: "ICC_Untagged",
    0x0412: "EffectsVisible",
    0x0413: "SpotHalftone",
    0x0414: "IDsBaseValue",
    0x0415: "UnicodeAlphaNames",
    0x0416: "IndexedColorTableCount",
    0x0417: "TransparentIndex",
    0x0419: "GlobalAltitude",
    0x041a: "SliceInfo",
    0x041b: "WorkflowURL",
    0x041c: "JumpToXPEP",
    0x041d: "AlphaIdentifiers",
    0x041e: "URL_List",
    0x0421: "VersionInfo",
    0x0422: "EXIFInfo",
    0x0423: "ExifInfo2",
    0x0424: "XMP",
    0x0425: "IPTCDigest",
    0x0426: "PrintScaleInfo",
    0x0428: "PixelInfo",
    0x0429: "LayerComps",
    0x042a: "AlternateDuotoneColors",
    0x042b: "AlternateSpotColors",
    0x042d: "LayerSelectionIDs",
    0x042e: "HDRToningInfo",
    0x042f: "PrintInfo",
    0x0430: "LayerGroupsEnabledID",
    0x0431: "ColorSamplersResource2",
    0x0432: "MeasurementScale",
    0x0433: "TimelineInfo",
    0x0434: "SheetDisclosure",
    0x0435: "DisplayInfo",
    0x0436: "OnionSkins",
    0x0438: "CountInfo",
    0x043a: "PrintInfo2",
    0x043b: "PrintStyle",
    0x043c: "MacintoshNSPrintInfo",
    0x043d: "WindowsDEVMODE",
    0x043e: "AutoSaveFilePath",
    0x043f: "AutoSaveFormat",
    0x0440: "PathSelectionState",
    0x0bb7: "ClippingPathName",
    0x0bb8: "OriginPathInfo",
    0x1b58: "ImageReadyVariables",
    0x1b59: "ImageReadyDataSets",
    0x1f40: "LightroomWorkflow",
    0x2710: "PrintFlagsInfo"
};

function load(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const arrayBuffer = e.target.result;

        const dataView = new DataView(arrayBuffer);
        for (let i = 0; i < dataView.byteLength - 2; i++) {
            // Search marker APP13
            if (dataView.getUint8(i) === 0xFF && dataView.getUint8(i + 1) === 0xED) {
                const app13Data = new Uint8Array(arrayBuffer.slice(i + 2));

                const photoshopTags = extractPhotoshopTags(app13Data);

                if (photoshopTags) {
                    return photoshopTags;
                } else {
                    console.warn("No photoshpo exif tags found.");
                }
                break;
            }
        }
    };

    reader.readAsArrayBuffer(file);
}

// https://github.com/exiftool/exiftool/blob/6e175fd7662e02f6d252b31ebb67222fbc6f8c37/lib/Image/ExifTool/Photoshop.pm#L355
function parseData(code, tagData) {
    switch (code) {
        case 0x0406:
            return parseJpegQuality(tagData);
        default:
            return tagData;
    }
}

// https://exiftool.org/TagNames/Photoshop.html#JPEG_Quality
// https://github.com/exiftool/exiftool/blob/6e175fd7662e02f6d252b31ebb67222fbc6f8c37/lib/Image/ExifTool/Photoshop.pm#L354
function parseJpegQuality(tagData) {
    const data = {};

    // Quality
    const qualitySigned16Int = ((tagData[0] << 8) | tagData[1]);
    if (qualitySigned16Int & 0x8000) {
        // Si es negativo, aplicar el complemento a dos
        data.PhotoshopQuality = -((~qualitySigned16Int & 0xFFFF) + 1);
    } else {
        data.PhotoshopQuality = qualitySigned16Int;
    }
    data.PhotoshopQuality += 4;

    // Format
    switch ((tagData[2] << 8) | tagData[3]) {
        case 0x0000: data.PhotoshopFormat = "Standard"; break;
        case 0x0001: data.PhotoshopFormat = "Optimized"; break;
        case 0x0101: data.PhotoshopFormat = "Progressive"; break;
    }

    // Scans
    data.ProgressiveScans = ((tagData[4] << 8) | tagData[5]) + 2;
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
            
            const codeName = code2string[code] || "Unknown";
            const tagData = parseData(code, rawTagData);

            photoshopTags[codeName] = tagData;

            i += 11 + nameLength + length;
        } else {
            i++;
        }
    }

    return photoshopTags;
}

module.exports = {
    parse: function (file) {
        return load(file);
    }
};
