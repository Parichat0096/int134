# check-docker.ps1

Write-Host "=== Docker Containers Status ===" -ForegroundColor Cyan
docker ps -a

Write-Host "`n=== Check if all containers are running ===" -ForegroundColor Cyan
$allRunning = docker ps --format "{{.Names}} {{.Status}}" | ForEach-Object {
    if ($_ -match "Up") { "$_ ✅" } else { "$_ ❌" }
}
$allRunning

Write-Host "`n=== Backend Logs (last 20 lines) ===" -ForegroundColor Cyan
docker logs --tail 20 express_backend

Write-Host "`n=== Frontend Logs (last 20 lines) ===" -ForegroundColor Cyan
docker logs --tail 20 nginx_frontend

Write-Host "`n=== Nginx Proxy Logs (last 20 lines) ===" -ForegroundColor Cyan
docker logs --tail 20 nginx_proxy
