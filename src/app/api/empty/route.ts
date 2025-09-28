// 空のAPIエンドポイント（Service Workerエラー回避用）
export async function GET() {
  return new Response('', { status: 200 });
}
