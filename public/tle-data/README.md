# TLE Data Folder Structure

Place your TLE files in this folder using the following structure:

```
public/tle-data/
├── 2025-07-28/
│   ├── tle_000000.txt  (00:00:00)
│   ├── tle_013008.txt  (01:30:08)
│   ├── tle_120000.txt  (12:00:00)
│   └── tle_235959.txt  (23:59:59)
├── 2025-07-29/
│   ├── tle_000000.txt
│   ├── tle_064500.txt  (06:45:00)
│   └── tle_180000.txt  (18:00:00)
└── 2025-07-30/
    └── tle_090000.txt
```

## File Naming Convention

- **Folder names**: `YYYY-MM-DD` format
- **File names**: `tle_HHMMSS.txt` where:
  - `HH` = hours (00-23)
  - `MM` = minutes (00-59) 
  - `SS` = seconds (00-59)

## TLE File Format

Each TLE file should contain standard three-line format:
```
SATELLITE NAME
1 NNNNNC NNNNNAAA NNNNN.NNNNNNNN +.NNNNNNNN +NNNNN-N +NNNNN-N N NNNNN
2 NNNNN NNN.NNNN NNN.NNNN NNNNNNN NNN.NNNN NNN.NNNN NN.NNNNNNNNNNNNNN
```

## Optional: Index Files

You can optionally create an `index.json` file in each date folder to list available TLE files:

```json
{
  "files": [
    "tle_000000.txt",
    "tle_013008.txt",
    "tle_120000.txt",
    "tle_235959.txt"
  ]
}
```

This improves loading performance by avoiding 404 requests for non-existent files.

## How It Works

1. The dashboard will automatically scan the date range you select
2. It loads TLE files from each date folder
3. Compares TLE content to detect real orbital updates (not just timestamp changes)
4. Uses the TLE epoch time (from Line 1) for accurate time placement
5. Displays statistics and visualizations based on real TLE changes