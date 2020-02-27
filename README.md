# deploy-github-pages

[![wtfpl badge](https://img.shields.io/github/license/wu-yu-xuan/deploy-github-pages)](https://github.com/wu-yu-xuan/deploy-github-pages/blob/master/LICENSE)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wu-yu-xuan/deploy-github-pages)

## How To Use It?

### Generate Token

Go to [Personal Access Tokens](https://github.com/settings/tokens) generate new token

Access to **repo** is needed

Copy and store this token, github won't store it for safety

### Add Secrets

Go to `https://github.com/{yourName}/{yourRepo}/settings/secrets`

Add a new secret, key is `PERSONAL_TOKEN`, value is the token you just generated

### Create Workflow

Create `/.github/workflows/{anyNameYouLike}.yml`

Content is like:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v2
      # use any other action here
      - name: deploy
        uses: wu-yu-xuan/deploy-github-pages@action
        with:
          personal_token: ${{ secrets.PERSONAL_TOKEN }} # important
          commit_message: ${{ github.event.head_commit.message }}
          publish_branch: gh-pages
          source_dir: build
          publish_dir: ./
          publish_repo: # like userName/repoName, default is current repo
          keep_files: false
```

or you can read

- [.github/workflows/index.yml](https://github.com/wu-yu-xuan/deploy-github-pages/blob/master/.github/workflows/index.yml)
- [lib/action.yml](https://github.com/wu-yu-xuan/deploy-github-pages/blob/action/action.yml)

for more information

## Who Is Using It?

- [wu-yu-xuan/blog.mscorlib.top](https://github.com/wu-yu-xuan/blog.mscorlib.top)
- [hamono/bilibili_text](https://github.com/hamono/bilibili_text)
- [hamono/bilibili-data](https://github.com/hamono/bilibili-data)
- [wu-yu-xuan/json-schema-to-interface](https://github.com/wu-yu-xuan/json-schema-to-interface)
- [wu-yu-xuan/deploy-github-pages](https://github.com/wu-yu-xuan/deploy-github-pages)

---

If you have trouble using it or have used it, let me known!
