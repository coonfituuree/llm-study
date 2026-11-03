"""Export the study workbook using only Python's standard library.

Usage: python tools/extract_data.py [workbook.xlsx]
Date-formatted Excel cells are restored as day/month, matching the visible sheet.
"""
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def extract(path):
    with zipfile.ZipFile(path) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        if workbook.find("m:workbookPr", NS).get("date1904") in ("1", "true"):
            raise ValueError("This exporter expects the workbook's 1900 date system.")
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = ["".join(n.itertext()) for n in ET.fromstring(archive.read("xl/sharedStrings.xml"))]
        styles = ET.fromstring(archive.read("xl/styles.xml"))
        formats = {int(n.get("numFmtId")): n.get("formatCode") for n in styles.findall("m:numFmts/m:numFmt", NS)}
        xfs = [int(n.get("numFmtId", 0)) for n in styles.find("m:cellXfs", NS)]
        date_styles = {i for i, fmt in enumerate(xfs) if formats.get(fmt, "").lower() == "d/m"}
        tasks = []
        recovered = 0
        for row in ET.fromstring(archive.read("xl/worksheets/sheet1.xml")).findall(".//m:row", NS):
            cells = {}
            for cell in row:
                value = cell.find("m:v", NS)
                inline = cell.find("m:is", NS)
                raw = value.text if value is not None else "".join(inline.itertext()) if inline is not None else ""
                text = strings[int(raw)] if cell.get("t") == "s" else raw
                restored = cell.get("t") not in ("s", "inlineStr") and int(cell.get("s", 0)) in date_styles and bool(raw)
                if restored:
                    date = dt.datetime(1899, 12, 30) + dt.timedelta(days=float(raw))
                    text = f"{date.day}/{date.month}"
                cells[re.sub(r"\d", "", cell.get("r"))] = {
                    "value": text, "raw": raw if restored else text,
                    "recovered": restored, "address": cell.get("r"),
                }
            get = lambda col: cells.get(col, {}).get("value", "")
            if not re.fullmatch(r"T\d{3}", get("J")):
                continue
            results = [cells.get(col, {"value": "", "raw": "", "recovered": False, "address": f"{col}{row.get('r')}"}) for col in "DEFGHI"]
            recovered += sum(c["recovered"] for c in results)
            name, url = get("B"), get("C")
            platform = "Codeforces" if "codeforces" in url.lower() or "codeforces" in name.lower() or re.search(r",\s*\d{3,4}\)", name) else "LeetCode"
            rating = re.search(r",\s*(\d{3,4})\)", name)
            tasks.append({"id": get("J"), "name": name, "difficulty": get("A"),
                          "platform": platform, "rating": int(rating[1]) if rating else None,
                          "url": url if re.match(r"https?://", url) else "", "row": int(row.get("r")), "results": results})
        return {"source": Path(path).name, "sheet": workbook.find("m:sheets/m:sheet", NS).get("name"),
                "sha256": hashlib.sha256(Path(path).read_bytes()).hexdigest(),
                "recoveredCells": recovered, "tasks": tasks}


if __name__ == "__main__":
    data = extract(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "chosen_tasks(1).xlsx")
    target = ROOT / "data.js"
    target.write_text("// Generated from the workbook by tools/extract_data.py.\nwindow.STUDY_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"Exported {len(data['tasks'])} tasks; restored {data['recoveredCells']} date-formatted fractions → {target.name}")
