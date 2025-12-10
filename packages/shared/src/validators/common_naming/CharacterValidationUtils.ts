/**
 * 文字種バリデーション用のユーティリティ関数
 */

/**
 * 半角文字のみかどうかをチェック
 * 半角文字: ASCII文字 (0x00-0x7F) のみ
 */
export const isHalfWidthOnly = (str: string): boolean => {
  if (str.length === 0) return true;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // ASCII文字 (0x00-0x7F) 以外は全角とみなす
    if (charCode > 0x7F) {
      return false;
    }
  }
  return true;
};
