// Thanks to https://exiftool.org/TagNames/Photoshop.html
const code2readable = {
 0x03e8: { name: "Photoshop2Info" },
 0x03e9: { name: "MacintoshPrintInfo" },
 0x03ea: { name: "XMLData" },
 0x03eb: { name: "Photoshop2ColorTable" },
 0x03ed: { name: "ResolutionInfo" },
 0x03ee: { name: "AlphaChannelsNames" },
 0x03ef: { name: "DisplayInfo" },
 0x03f0: { name: "PStringCaption" },
 0x03f1: { name: "BorderInformation" },
 0x03f2: { name: "BackgroundColor" },
 0x03f3: { name: "PrintFlags" },
 0x03f4: { name: "BW_HalftoningInfo" },
 0x03f5: { name: "ColorHalftoningInfo" },
 0x03f6: { name: "DuotoneHalftoningInfo" },
 0x03f7: { name: "BW_TransferFunc" },
 0x03f8: { name: "ColorTransferFuncs" },
 0x03f9: { name: "DuotoneTransferFuncs" },
 0x03fa: { name: "DuotoneImageInfo" },
 0x03fb: { name: "EffectiveBW" },
 0x03fc: { name: "ObsoletePhotoshopTag1" },
 0x03fd: { name: "EPSOptions" },
 0x03fe: { name: "QuickMaskInfo" },
 0x03ff: { name: "ObsoletePhotoshopTag2" },
 0x0400: { name: "TargetLayerID" },
 0x0401: { name: "WorkingPath" },
 0x0402: { name: "LayersGroupInfo" },
 0x0403: { name: "ObsoletePhotoshopTag3" },
 0x0404: { name: "IPTCData" },
 0x0405: { name: "RawImageMode" },
 0x0406: {
  name: "JPEG_Quality",
  parser: (tagData) => {
   // https://exiftool.org/TagNames/Photoshop.html#JPEG_Quality
   // https://github.com/exiftool/exiftool/blob/6e175fd7662e02f6d252b31ebb67222fbc6f8c37/lib/Image/ExifTool/Photoshop.pm#L354
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

   return data;
  }
 },
 0x0408: { name: "GridGuidesInfo" },
 0x0409: { name: "PhotoshopBGRThumbnail" },
 0x040a: { name: "CopyrightFlag" },
 0x040b: { name: "URL" },
 0x040c: { name: "PhotoshopThumbnail" },
 0x040d: { name: "GlobalAngle" },
 0x040e: { name: "ColorSamplersResource" },
 0x040f: { name: "ICC_Profile" },
 0x0410: { name: "Watermark" },
 0x0411: { name: "ICC_Untagged" },
 0x0412: { name: "EffectsVisible" },
 0x0413: { name: "SpotHalftone" },
 0x0414: { name: "IDsBaseValue" },
 0x0415: { name: "UnicodeAlphaNames" },
 0x0416: { name: "IndexedColorTableCount" },
 0x0417: { name: "TransparentIndex" },
 0x0419: { name: "GlobalAltitude" },
 0x041a: { name: "SliceInfo" },
 0x041b: { name: "WorkflowURL" },
 0x041c: { name: "JumpToXPEP" },
 0x041d: { name: "AlphaIdentifiers" },
 0x041e: { name: "URL_List" },
 0x0421: { name: "VersionInfo" },
 0x0422: { name: "EXIFInfo" },
 0x0423: { name: "ExifInfo2" },
 0x0424: { name: "XMP" },
 0x0425: { name: "IPTCDigest" },
 0x0426: { name: "PrintScaleInfo" },
 0x0428: { name: "PixelInfo" },
 0x0429: { name: "LayerComps" },
 0x042a: { name: "AlternateDuotoneColors" },
 0x042b: { name: "AlternateSpotColors" },
 0x042d: { name: "LayerSelectionIDs" },
 0x042e: { name: "HDRToningInfo" },
 0x042f: { name: "PrintInfo" },
 0x0430: { name: "LayerGroupsEnabledID" },
 0x0431: { name: "ColorSamplersResource2" },
 0x0432: { name: "MeasurementScale" },
 0x0433: { name: "TimelineInfo" },
 0x0434: { name: "SheetDisclosure" },
 0x0435: { name: "DisplayInfo" },
 0x0436: { name: "OnionSkins" },
 0x0438: { name: "CountInfo" },
 0x043a: { name: "PrintInfo2" },
 0x043b: { name: "PrintStyle" },
 0x043c: { name: "MacintoshNSPrintInfo" },
 0x043d: { name: "WindowsDEVMODE" },
 0x043e: { name: "AutoSaveFilePath" },
 0x043f: { name: "AutoSaveFormat" },
 0x0440: { name: "PathSelectionState" },
 0x0bb7: { name: "ClippingPathName" },
 0x0bb8: { name: "OriginPathInfo" },
 0x1b58: { name: "ImageReadyVariables" },
 0x1b59: { name: "ImageReadyDataSets" },
 0x1f40: { name: "LightroomWorkflow" },
 0x2710: { name: "PrintFlagsInfo" }
};

export default code2readable;