set -e
{{.SyncFiles}}
{{.SaveRelease}}
source $HOME/.envrc
$APP_ROOT/scripts/install_crontab.sh
{{.RestartServer}}
