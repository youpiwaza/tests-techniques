# How to work locally

All you need to know about how to setup a local developpment environment for this project.

## Local environment

For me, it's on Windows > [WSL / Windows Subsystem for Linux](https://docs.microsoft.com/fr-fr/windows/wsl/install) & [docker desktop](https://www.docker.com/products/docker-desktop/).

Cf. my [setup project](https://github.com/youpiwaza/install-dev-env) if you want to get the same setup.

## Docker container setup

Either a `docker run` command, or dedicated `docker compose file`.

Dockerhub image : [takeyamajp/ubuntu-sshd](https://hub.docker.com/r/takeyamajp/ubuntu-sshd).

🚨 Adapt the path according to your needs.

```bash
# Example with ubuntu + setup ssh access, basics for ansible server setup
## Start container
docker run
  -d                                                                                                        \
  --name PROJECT-ubuntu-sshd                                                                                \
  -e ROOT_PASSWORD=root                                                                                     \
  -e TZ=Europe/Paris                                                                                        \
  --mount type=bind,source="/home/youpiwaza/_dev/_current/PROJECT",destination=/var/www/html/PROJECT        \
  -p 8022:22                                                                                                \
  -p 8080:80                                                                                                \
  takeyamajp/ubuntu-sshd:ubuntu22.04

## Create a local file to send through ssh
touch hey.txt

## Send file to container through ssh
scp -P 8022 -r ./hey.txt root@localhost:/home/hey.txt
# > Pass ?
# > root

## 📌 Test sending
### Local container interactive access
docker exec -it PROJECT-ubuntu-sshd bash
> ls /home

## ✅ OK
> root@1fb8dddc5070:/# ls /home/
# > hey.txt

## Exit container
> exit

# Stop & remove container
docker stop PROJECT-ubuntu-sshd && docker rm PROJECT-ubuntu-sshd
```

## Ansible installation

If some automated server installation is used, here's how to install [Ansible](https://docs.ansible.com/ansible/latest/index.html).

One-liner installation, through a dedicated shell script, source is [here](https://github.com/youpiwaza/install-ansible-script/).

Works on Ubuntu & WSL > Ubuntu

🚨 Adapt `ansible/hosts` file according to your needs, cf. container setup ^.

```bash
curl https://raw.githubusercontent.com/youpiwaza/install-ansible-script/master/ansible-install.sh | bash

# 📌 Verification
ansible --version
```
