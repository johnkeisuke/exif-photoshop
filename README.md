# exif-photoshop
Javascript library that runs on browser to extract exif photoshop data such as jpeg compression

After trying other JavaScript exif libraries I found out none of them parse Photoshop data, but other parsers in other languages did.

Here's a simple library that retrieve this data, **currently I only parse JPEG Quality**, other fields are returned in binary, but is easily extendable as you can see in https://github.com/johnkeisuke/exif-photoshop/blob/main/tags.js file.

# Useful info
Exif metadata is coded in binary into your file, usually the marker of the start of this info is APP1 Marker (0xFFE1) and that's what usually libraries work with.

Photoshop saves its metadata in marker APP13 (0xFFED) also known as IPTC (and that's all I found easily online).

I relied on exiftool for the rest:

Photoshop tags meaning: https://exiftool.org/TagNames/Photoshop.html#JPEG_Quality

Exiftools implementation: https://github.com/exiftool/exiftool/blob/master/lib/Image/ExifTool/Photoshop.pm

Check those to extend funcionalities. (Like I replicated JPEG Quality https://github.com/exiftool/exiftool/blob/master/lib/Image/ExifTool/Photoshop.pm#L354)

# How to use

Install it with:
```
node install exif-photoshop --save
```

Use it in your file like:
```
import * as EXIF_PHOTOSHOP from "exif-photoshop";

[...]

const photoshopMetadata = await EXIF_PHOTOSHOP.parse(file);
```

being **file** retreieved by **input files** or by drag-and-drop **ev.dataTransfer.files**

Output example:
```
{
 "1092" : Uint8Array(151) [0, 0, 0, …],
 "BackgroundColor" :  Uint8Array(10) [0, 0, 255, …],
 "ColorHalftoningInfo" : Uint8Array(72) [0, 47, 102, …],
 "ColorTransferFuncs" : Uint8Array(112) [0, 0, 255, …],
 "GlobalAltitude" : Uint8Array(4) [0, 0, 0, …],
 "GlobalAngle" : Uint8Array(4) [0, 0, 0, …],
 "GridGuidesInfo" : Uint8Array(91) [0, 0, 0, …],
 "IDsBaseValue" : Uint8Array(4) [0, 0, 3, …],
 "IPTCData" : Uint8Array(15) [28, 1, 90, …],
 "IPTCDigest" : Uint8Array(16) [205, 207, 250, …],
 "JPEG_Quality" : {PhotoshopQuality: 5, PhotoshopFormat: 'Progressive', ProgressiveScans: 4}
 "PhotoshopThumbnail" : Uint8Array(6869) [0, 0, 0, …],
 "PixelInfo" : Uint8Array(12) [0, 0, 0, …],
 "PrintFlags" : Uint8Array(9) [0, 0, 0, …],
 "PrintFlagsInfo" : Uint8Array(10) [0, 1, 0, …],
 "PrintInfo2" : Uint8Array(239) [0, 0, 0,  …],
 "PrintScaleInfo" : Uint8Array(14) [0, 0, 0,  …],
 "PrintStyle" : Uint8Array(557) [0, 0, 0, …],
 "ResolutionInfo" : Uint8Array(16) [0, 72, 0, …],
 "SliceInfo" : Uint8Array(851) [0, 0, 0, …],
 "URL_List" : Uint8Array(4) [0, 0, 0, …],
 "VersionInfo" : Uint8Array(87) [0, 0, 0,  …]
}
```
