echo "Customizing my git config to feel at home..."
git config --global --add push.default simple
git config --global --add color.ui true
git config --global --add alias.caca push
git config --global --add alias.pousse push
git config --global --add alias.pousse-pousse push
git config --global --add alias.fesse fetch
git config --global --add alias.ass add
git config --global --add alias.st status
git config --global --add alias.df diff
git config --global --add alias.co checkout
git config --global --add alias.ci commit
git config --global --add alias.br branch
git config --global --add alias.amend "commit --amend"
git config --global --add alias.who "shortlog -sne"
git config --global --add alias.oneline "log --pretty=oneline --abbrev-commit --graph"
git config --global --add alias.changes "diff --name-status"
git config --global --add alias.dic "diff --cached"
git config --global --add alias.diffstat "diff --stat"
git config --global --add alias.lc "!git oneline ORIG_HEAD.. --stat --no-merges"
git config --global --add alias.create-pull-request "!sh -c 'stash pull-request $0 $@'"
git config --global --add alias.up "fetch --all -p && pull --rebase --autostash"
git config --global --add rebase.autostash true
git config --global --add rerere.enabled true
git config --global --add merge.npm-merge-driver.name "automatically merge npm lockfiles"
git config --global --add merge.npm-merge-driver.driver "npx npm-merge-driver merge %A %O %B %P"
echo "...done!"
