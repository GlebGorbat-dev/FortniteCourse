// Health check endpoint for Docker
export async function GET() {
  return Response.json({ status: 'healthy' }, { status: 200 })
}
