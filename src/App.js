import { useState, useEffect, useRef } from "react";

function App() {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [showSettings, setShowSettings] = useState(false);
  const [partyMode, setPartyMode] = useState(false); // パーティーモードの状態
  const displayRef = useRef(null);

  const adjustFontSize = () => {
    const display = displayRef.current;
    if (!display) return;

    const text = display.innerText.trim();
    if (text === "") {
      // テキストが空の場合はデフォルトのフォントサイズを設定
      display.style.fontSize = "16px";
      return;
    }

    // ウィンドウの幅と高さを取得
    const maxWidth = window.innerWidth - 20; // パディング分を減算
    const maxHeight = window.innerHeight - 20;

    // フォントサイズの初期値と範囲を設定
    let minFontSize = 10;
    let maxFontSize = 1000;
    let fontSize = minFontSize;

    // 二分探索で最適なフォントサイズを見つける
    while (minFontSize <= maxFontSize) {
      fontSize = Math.floor((minFontSize + maxFontSize) / 2);
      display.style.fontSize = fontSize + "px";

      // テキストのサイズを測定
      const range = document.createRange();
      range.selectNodeContents(display);
      const rect = range.getBoundingClientRect();
      const textWidth = rect.width;
      const textHeight = rect.height;

      // テキストがウィンドウ内に収まるか確認
      if (textWidth <= maxWidth && textHeight <= maxHeight) {
        // もっと大きなフォントサイズを試す
        minFontSize = fontSize + 1;
      } else {
        // フォントサイズを小さくする
        maxFontSize = fontSize - 1;
      }
    }

    // 最適なフォントサイズを設定
    display.style.fontSize = (minFontSize - 1) + "px";
  };

  useEffect(() => {
    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, []);

  const handleInput = () => {
    adjustFontSize();
  };

  // アニメーション用のスタイルを定義
  const partyStyles = partyMode
    ? {
        backgroundColor: undefined,
        backgroundImage:
          "linear-gradient(to bottom left, red, orange, yellow, green, blue, indigo, violet)",
        backgroundSize: "200% 200%",
        animation: "bgAnimation 5s infinite linear",
      }
    : {
        backgroundColor: bgColor,
        backgroundImage: undefined,
        animation: undefined,
      };

  const textStyles = partyMode
    ? {
        color: undefined,
        background:
          "linear-gradient(to bottom left, red, orange, yellow, green, blue, indigo, violet)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "textAnimation 2s infinite linear",
      }
    : {
        color: textColor,
        background: undefined,
        WebkitBackgroundClip: undefined,
        WebkitTextFillColor: undefined,
        animation: undefined,
      };

  return (
    <div style={{ height: "100%", ...partyStyles }}>
      {/* キーフレームを定義 */}
      <style>
        {`
          @keyframes bgAnimation {
            0% { background-position: top right; }
            100% { background-position: bottom left; }
          }
          @keyframes textAnimation {
            0% { background-position: bottom left; }
            100% { background-position: top right; }
          }
        `}
      </style>
      <div
        ref={displayRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
          wordBreak: "break-word",
          fontFamily: fontFamily,
          outline: "none",
          overflow: "hidden",
          margin: 0,
          ...textStyles,
        }}
      ></div>
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          padding: "5px",
          borderRadius: "5px",
          cursor: "pointer",
          userSelect: "none",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
        onClick={() => setShowSettings(!showSettings)}
      >
        {/* ハンバーガーメニューまたはバツアイコンを切り替え */}
        {showSettings ? (
          // バツアイコン
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12Z"
            />
          </svg>
        ) : (
          // ハンバーガーメニューアイコン
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3,6H21V8H3V6 M3,11H21V13H3V11 M3,16H21V18H3V16"
            />
          </svg>
        )}
      </div>
      {showSettings && (
        <div
          style={{
            position: "fixed",
            top: "40px",
            left: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <label>
            フォント:
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              style={{ marginLeft: "5px" }}
            >
              <option value="sans-serif">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
              <option value="fantasy">Fantasy</option>
              <option value="system-ui">System UI</option>
              {/* 必要に応じてフォントを追加 */}
            </select>
          </label>
          <br />
          <label>
            文字色:
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{ marginLeft: "5px" }}
              disabled={partyMode} // パーティーモード時は無効化
            />
          </label>
          <br />
          <label>
            背景色:
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ marginLeft: "5px" }}
              disabled={partyMode} // パーティーモード時は無効化
            />
          </label>
          <br />
          <label>
            パーティーモード:
            <input
              type="checkbox"
              checked={partyMode}
              onChange={() => setPartyMode(!partyMode)}
              style={{ marginLeft: "5px" }}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default App;