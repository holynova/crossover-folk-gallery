#!/usr/bin/env python3
import os
import glob
import shutil
import subprocess
import json
import zipfile

PROJECT_ROOT = "/Users/sym/code/crossover-folk-gallery"
FOLK_DIR = "/Users/sym/Pictures/folk_art_series"
FOLK_ND_DIR = "/Users/sym/Pictures/folk_art_series/national_day"
SKINS_DIR = "/Users/sym/Pictures/wzry_crossover_skins"

# 1. Folk Art Metadata
FOLK_ITEMS = [
    # National Day
    {
        "id": "folk-nd-01",
        "category": "folk_art",
        "subcategory": "folk_national_day",
        "category_name": "民间农民画",
        "subcategory_name": "盛世华诞·国庆篇",
        "title": "水乡欢歌 · 喜迎国庆",
        "badge": "国庆特辑",
        "tags": ["水乡庆典", "金红舞狮", "腰鼓秧歌", "紫藤垂瀑", "彩船巡游"],
        "quote": "盛世华诞金秋庆，欢歌笑语绕水乡。",
        "desc": "散点透视俯瞰全景，展现江南农村大院与广场热烈欢度十月国庆盛景。广场上红灯笼与彩旗猎猎，金红双狮欢腾跃动，腰鼓秧歌队红绸飞舞；白墙贴满大红剪纸福字与“国泰民安”对联，扎大红绸花的红色手扶拖拉机与插旗二八大杠停驻，河道彩旗摇橹船巡游，满屏洋溢着纯真豪迈的盛世丰年喜悦。",
        "src_path": os.path.join(FOLK_ND_DIR, "01_水乡欢歌_喜迎国庆.png"),
        "rel_img": "images/folk_art/01_水乡欢歌_喜迎国庆.png",
        "rel_thumb": "thumbnails/folk_art/01_水乡欢歌_喜迎国庆.jpg",
    },
    {
        "id": "folk-nd-02",
        "category": "folk_art",
        "subcategory": "folk_national_day",
        "category_name": "民间农民画",
        "subcategory_name": "盛世华诞·国庆篇",
        "title": "长街百家宴 · 盛世欢聚",
        "badge": "国庆特辑",
        "tags": ["长街流水席", "八仙桌", "大闸蟹", "蓝印花布", "古石拱桥"],
        "quote": "百米长街摆佳宴，举杯共贺盛世平。",
        "desc": "沿江南水乡古运河青石板老街摆开数十米红漆八仙桌“国庆长街宴”。大蒸笼水乡八大碗、澄黄大闸蟹热气腾腾白雾缭绕；全村老少团坐举杯同庆，妇女端蒸盘穿梭席间，孩童手挥七彩风车嬉戏追逐，两岸排满大红灯笼与大幅蓝印花布，石拱桥上看客如织。",
        "src_path": os.path.join(FOLK_ND_DIR, "02_长街百家宴_盛世欢聚.png"),
        "rel_img": "images/folk_art/02_长街百家宴_盛世欢聚.png",
        "rel_thumb": "thumbnails/folk_art/02_长街百家宴_盛世欢聚.jpg",
    },
    {
        "id": "folk-nd-03",
        "category": "folk_art",
        "subcategory": "folk_national_day",
        "category_name": "民间农民画",
        "subcategory_name": "盛世华诞·国庆篇",
        "title": "火树银花 · 水乡国庆之夜",
        "badge": "国庆特辑",
        "tags": ["点彩烟花", "非遗打铁花", "水乡戏台", "万家灯火", "夜景盛宴"],
        "quote": "火树银花漫天落，星雨飞溅醉江南。",
        "desc": "墨玉深蓝夜空下，水乡运河畔国庆之夜盛大烟火晚会与非遗打铁花绝技。高密度细碎点彩烟花在夜空如火树银花怒放；河埠头民间艺人击打出千万点金红星雨铁花瀑布凌空飞溅；水乡古戏台越剧好戏连台，石拱桥与民居檐角万家灯火通明，孩童骑在大人肩头欢呼雀跃。",
        "src_path": os.path.join(FOLK_ND_DIR, "03_火树银花_水乡国庆之夜.png"),
        "rel_img": "images/folk_art/03_火树银花_水乡国庆之夜.png",
        "rel_thumb": "thumbnails/folk_art/03_火树银花_水乡国庆之夜.jpg",
    },
    # Daily Scenes
    {
        "id": "folk-daily-01",
        "category": "folk_art",
        "subcategory": "folk_daily",
        "category_name": "民间农民画",
        "subcategory_name": "水乡岁月·日常篇",
        "title": "水乡晒秋 · 丰收大院",
        "badge": "日常民俗",
        "tags": ["丰收晒秋", "金黄玉米", "红辣椒", "红色拖拉机", "二八大杠"],
        "quote": "粮仓满溢秋光好，农家大院笑声浓。",
        "desc": "江南白墙黛瓦农家大院秋收翻晒粮食的壮丽全景。院坝铺满金黄玉米、火红辣椒串与稻谷竹簸箕；门楼紫藤繁花如粉紫瀑布垂挂，墙边晾晒靛蓝蓝印花布；村民忙碌翻晒，孩童欢笑追赶白鹅小狗，二楼阳台老人抱孙笑看丰收。",
        "src_path": os.path.join(FOLK_DIR, "01_水乡晒秋_丰收大院.png"),
        "rel_img": "images/folk_art/04_水乡晒秋_丰收大院.png",
        "rel_thumb": "thumbnails/folk_art/04_水乡晒秋_丰收大院.jpg",
    },
    {
        "id": "folk-daily-02",
        "category": "folk_art",
        "subcategory": "folk_daily",
        "category_name": "民间农民画",
        "subcategory_name": "水乡岁月·日常篇",
        "title": "春山采茶 · 炒茶欢歌",
        "badge": "日常民俗",
        "tags": ["茶乡春意", "大铁锅炒茶", "点彩茶山", "竹匾分茶", "粗陶茶壶"],
        "quote": "嫩芽初摘春山绿，铁锅翻炒溢清香。",
        "desc": "清明谷雨时节，江南茶山脚下的白墙青瓦大院，茶农齐聚炒制新茶。茶山层叠碧绿，大铁锅生火，茶农双手翻炒新茶升起细碎蒸气；姑娘们在竹匾前分拣鲜嫩茶芽，长木桌摆放粗陶大茶壶与瓷碗，茶香飘满水乡。",
        "src_path": os.path.join(FOLK_DIR, "02_春山采茶_炒茶欢歌.png"),
        "rel_img": "images/folk_art/05_春山采茶_炒茶欢歌.png",
        "rel_thumb": "thumbnails/folk_art/05_春山采茶_炒茶欢歌.jpg",
    },
    {
        "id": "folk-daily-03",
        "category": "folk_art",
        "subcategory": "folk_daily",
        "category_name": "民间农民画",
        "subcategory_name": "水乡岁月·日常篇",
        "title": "古河埠头 · 端午龙舟",
        "badge": "日常民俗",
        "tags": ["端午龙舟", "青石埠头", "包粽淘米", "艾草菖蒲", "激流飞舟"],
        "quote": "鼓声阵阵龙舟跃，青粽飘香古运河。",
        "desc": "青石板河埠头与水乡两岸，端午节彩绘木龙舟破浪前行击鼓飞溅点彩白浪；河埠头石阶上妇女们淘米洗粽叶包裹长条青粽，门楣高悬艾草菖蒲；两岸石阶与石拱桥上挤满看热闹的乡亲。",
        "src_path": os.path.join(FOLK_DIR, "03_古河埠头_端午龙舟.png"),
        "rel_img": "images/folk_art/06_古河埠头_端午龙舟.png",
        "rel_thumb": "thumbnails/folk_art/06_古河埠头_端午龙舟.jpg",
    },
    {
        "id": "folk-daily-04",
        "category": "folk_art",
        "subcategory": "folk_daily",
        "category_name": "民间农民画",
        "subcategory_name": "水乡岁月·日常篇",
        "title": "喜气临门 · 水乡迎亲",
        "badge": "日常民俗",
        "tags": ["水路迎亲", "石拱桥", "大红双喜", "唢呐铜锣", "流水喜宴"],
        "quote": "喜船靠岸锣鼓喧，佳偶天成美名传。",
        "desc": "水乡石拱桥与临水大宅门前，一场热烈的水路传统迎亲盛景。披红挂彩的摇橹花船靠岸，新郎戴红花、新娘撑红伞穿红碎花嫁衣踏上石桥；唢呐铜锣震天，白墙贴满大红双喜字，院落流水席八仙桌红火开宴，孩童捂耳点爆竹。",
        "src_path": os.path.join(FOLK_DIR, "04_喜气临门_水乡迎亲.png"),
        "rel_img": "images/folk_art/07_喜气临门_水乡迎亲.png",
        "rel_thumb": "thumbnails/folk_art/07_喜气临门_水乡迎亲.jpg",
    },
    {
        "id": "folk-daily-05",
        "category": "folk_art",
        "subcategory": "folk_daily",
        "category_name": "民间农民画",
        "subcategory_name": "水乡岁月·日常篇",
        "title": "夏夜清风 · 露天电影",
        "badge": "日常民俗",
        "tags": ["露天电影", "放映机光束", "打谷场", "麦秸垛", "夏夜乡愁"],
        "quote": "银幕高悬夏夜凉，竹椅摇扇话家常。",
        "desc": "夏夜打谷场上拉起白色大银幕，老式放映机打出明亮光束穿透夜空；男女老少竹椅马扎齐聚，孩子们爬在麦秸垛或坐在拖拉机车斗里看戏，妇女摇蒲扇纳凉切红西瓜；深蓝点彩星空倒映在池塘中，承载难忘夏夜乡愁。",
        "src_path": os.path.join(FOLK_DIR, "05_夏夜清风_露天电影.png"),
        "rel_img": "images/folk_art/08_夏夜清风_露天电影.png",
        "rel_thumb": "thumbnails/folk_art/08_夏夜清风_露天电影.jpg",
    },
]

# 2. Extract skins metadata from /tmp/skins_data.json
with open("/tmp/skins_data.json", "r", encoding="utf-8") as f:
    raw_skins_data = json.load(f)

SKIN_ITEMS = []
for series_key, series_info in raw_skins_data.items():
    title = series_info["title"]
    folder = series_info["folder"]
    for s in series_info["skins"]:
        item_id = f"skin-{folder}-{s['id']}"
        src_path = os.path.join(SKINS_DIR, folder, s["file"])
        rel_img = f"images/skins/{folder}/{s['file']}"
        thumb_name = os.path.splitext(s["file"])[0] + ".jpg"
        rel_thumb = f"thumbnails/skins/{folder}/{thumb_name}"
        
        SKIN_ITEMS.append({
            "id": item_id,
            "category": "wzry_skins",
            "subcategory": folder,
            "category_name": "王者荣耀联名皮肤",
            "subcategory_name": title,
            "title": s["skin_name"],
            "hero": s["hero"],
            "anime_role": s["anime_role"],
            "hero_class": s["class"],
            "badge": s["badge"],
            "price": s["price"],
            "quote": s["quote"],
            "desc": s["desc"],
            "vfx": s["vfx"],
            "src_path": src_path,
            "rel_img": rel_img,
            "rel_thumb": rel_thumb,
        })

print(f"Loaded {len(FOLK_ITEMS)} folk art items and {len(SKIN_ITEMS)} skin items.")

# 3. Process all images: Copy originals and create thumbnails using sips
all_items = FOLK_ITEMS + SKIN_ITEMS

for item in all_items:
    dst_img = os.path.join(PROJECT_ROOT, item["rel_img"])
    dst_thumb = os.path.join(PROJECT_ROOT, item["rel_thumb"])
    os.makedirs(os.path.dirname(dst_img), exist_ok=True)
    os.makedirs(os.path.dirname(dst_thumb), exist_ok=True)
    
    # Copy original
    if not os.path.exists(dst_img) or os.path.getsize(dst_img) != os.path.getsize(item["src_path"]):
        shutil.copy2(item["src_path"], dst_img)
    
    # Store file size
    item["file_size_bytes"] = os.path.getsize(dst_img)
    item["file_size_formatted"] = f"{item['file_size_bytes'] / (1024*1024):.2f} MB"
    
    # Generate thumbnail
    if not os.path.exists(dst_thumb):
        subprocess.run([
            "sips",
            "-s", "format", "jpeg",
            "-s", "formatOptions", "82",
            "-Z", "800",
            item["src_path"],
            "--out", dst_thumb
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("All original images copied and thumbnails generated.")

# 4. Create Pre-packaged ZIP files
downloads_dir = os.path.join(PROJECT_ROOT, "downloads")
os.makedirs(downloads_dir, exist_ok=True)

# Package 1: Folk art (8 images)
folk_zip = os.path.join(downloads_dir, "folk_art_original_8.zip")
with zipfile.ZipFile(folk_zip, "w", zipfile.ZIP_DEFLATED) as zf:
    for item in FOLK_ITEMS:
        zf.write(os.path.join(PROJECT_ROOT, item["rel_img"]), arcname=f"民间农民画_{os.path.basename(item['rel_img'])}")
print(f"Created {folk_zip}: {os.path.getsize(folk_zip) / (1024*1024):.2f} MB")

# Package 2: Demon Slayer skins (20 images)
ds_zip = os.path.join(downloads_dir, "demon_slayer_skins_20.zip")
with zipfile.ZipFile(ds_zip, "w", zipfile.ZIP_DEFLATED) as zf:
    for item in SKIN_ITEMS:
        if item["subcategory"] == "01_demon_slayer":
            zf.write(os.path.join(PROJECT_ROOT, item["rel_img"]), arcname=f"鬼灭之刃联名_{os.path.basename(item['rel_img'])}")
print(f"Created {ds_zip}: {os.path.getsize(ds_zip) / (1024*1024):.2f} MB")

# Package 3: Other 5 anime series skins (25 images)
anime_zip = os.path.join(downloads_dir, "anime_5_series_skins_25.zip")
with zipfile.ZipFile(anime_zip, "w", zipfile.ZIP_DEFLATED) as zf:
    for item in SKIN_ITEMS:
        if item["subcategory"] != "01_demon_slayer":
            sub_name = item["subcategory_name"]
            zf.write(os.path.join(PROJECT_ROOT, item["rel_img"]), arcname=f"{sub_name}_{os.path.basename(item['rel_img'])}")
print(f"Created {anime_zip}: {os.path.getsize(anime_zip) / (1024*1024):.2f} MB")

# Clean clean items dictionary for web json
web_data = []
for item in all_items:
    clean_item = {k: v for k, v in item.items() if k != "src_path"}
    web_data.append(clean_item)

# 5. Write data.js
data_js_path = os.path.join(PROJECT_ROOT, "assets/js/data.js")
with open(data_js_path, "w", encoding="utf-8") as f:
    f.write("// AI Artworks Dataset (53 items: 8 Folk Art + 45 WZRY Crossover Skins)\n")
    f.write("window.ARTWORKS_DATA = " + json.dumps(web_data, ensure_ascii=False, indent=2) + ";\n")

print(f"Wrote {data_js_path} with {len(web_data)} items.")
