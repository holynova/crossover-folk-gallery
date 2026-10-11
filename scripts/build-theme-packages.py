#!/usr/bin/env python3
"""Build original-image archives for GitHub Releases, never for the static site."""
import hashlib
import json
import re
import zipfile
from pathlib import Path
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
s=(ROOT/'assets/js/data.js').read_text()
items=json.loads(s[s.index('['):s.rindex(']')+1])
version='v3.3.0'
output=ROOT/'output/release-archives'/version
output.mkdir(parents=True,exist_ok=True)
themes={}
for item in items:themes.setdefault(item['theme'],[]).append(item)
metadata={}
for theme,group in themes.items():
    name=re.sub(r'[\\/:*?"<>|]','_',theme)
    filename=f'{name}-王者荣耀联名原图.zip'
    archive=output/filename
    manifest=[]
    with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_STORED) as z:
        for item in group:
            source=ROOT/item['original']
            body=source.read_bytes()
            member=f'{name}/{source.name}'
            entry=zipfile.ZipInfo(member,date_time=(1980,1,1,0,0,0))
            entry.external_attr=0o100644 << 16
            z.writestr(entry,body)
            manifest.append({'id':item['id'],'filename':member,'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest()})
        info=zipfile.ZipInfo(f'{name}/manifest.json',date_time=(1980,1,1,0,0,0))
        info.external_attr=0o100644 << 16
        z.writestr(info,json.dumps({'theme':theme,'count':len(group),'items':manifest},ensure_ascii=False,indent=2))
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len([n for n in z.namelist() if n.endswith('.png')])==len(group)
    metadata[theme]={'count':len(group),'bytes':archive.stat().st_size,'filename':filename,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'url':f'https://github.com/holynova/crossover-folk-gallery/releases/download/{version}/{quote(filename)}'}
(ROOT/'assets/js/downloads.js').write_text('window.THEME_DOWNLOADS = '+json.dumps(metadata,ensure_ascii=False,indent=2)+';\n')
(output/'manifest.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
print(f'Validated {len(metadata)} archives / {sum(x["count"] for x in metadata.values())} original PNGs / {sum(x["bytes"] for x in metadata.values())/1048576:.2f} MiB')
