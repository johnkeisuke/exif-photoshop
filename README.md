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

Install it with
```
node install exif-photoshop --save
```

Use it in your file like
```
import * as EXIF_PHOTOSHOP from "exif-photoshop";

[...]

const photoshopMetadata = await EXIF_PHOTOSHOP.parse(file);
```

being file retreieved by input files or by drag-and-drop ev.dataTransfer.files
