
## 🔧 **What is Ansible?**
Ansible is an **open-source configuration management, provisioning, and automation tool**.

You use it to:
- Install software (like Java, Docker, Jenkins, ArgoCD)
- Configure servers
- Automate routine tasks
- Deploy applications

Ansible is **agentless**. That means no software needs to be installed on the target machines—it uses SSH to connect and do its thing.

---

## 🧠 How Ansible Works
1. You write **playbooks** (in YAML).
2. Each playbook has **tasks** to run on **hosts** (your EC2s, for example).
3. You run `ansible-playbook playbook.yml`, and Ansible:
    - SSHs into your target machines (like those in private subnets via the bastion)
    - Executes the steps defined in your playbook

---

## 🔑 Common Concepts

| Term             | Meaning |
|------------------|--------|
| **Inventory**     | A file listing all your hosts (IPs, hostnames) |
| **Playbook**      | YAML file defining configuration tasks |
| **Task**          | A single command (e.g., install Docker) |
| **Role**          | Reusable set of tasks, variables, templates |
| **Handlers**      | Tasks triggered by change (e.g., restart nginx) |
| **Modules**       | Built-in functions (e.g., `apt`, `yum`, `copy`, `service`) |
| **Variables**     | Dynamic values passed into tasks |
| **Templates**     | Config files using Jinja2 (dynamic generation) |
| **Facts**         | System data gathered automatically |
| **Jump Host**     | A public-accessible EC2 (like your Bastion) used to SSH into private ones |
| **Idempotency**   | You can run Ansible repeatedly—it won’t redo things unnecessarily |

---

## 🧾 Basic Folder Structure

```
ansible/
├── inventory/
│   ├── hosts.ini         # IPs of servers
│   └── group_vars/
│       └── all.yml     # Variables for all hosts
├── playbooks/
│   └── roles/
│     ├── argocd/
│     │  ├── tasks/
│     │     └── main.yml  # Steps to install argocd
│     ├── docker/
│     │  ├── tasks/
│     │     └── main.yml  # Steps to install Docker(we did this in the bootstrap during provisioning)
│     ├── jenkins/
│     │  ├── tasks/
│     │  │   ├── main.yml
│     │  │   └── postsetup.yml  # Post-install configuration
│     │  ├── files/
│     │  │   ├── plugins.txt     # List of Jenkins plugins
│     │  │   └── seed_job.groovy # Groovy script to create job
│     │  └── templates/
│     │      └── basic-security.groovy.j2  # Admin user creation
│     ├── k8s/
│     │  ├── api-gateway/
│     │  │  ├──ingress.yaml
│     │  │  └── configmap.yaml
│     │  ├── argocd/
│     │  │  ├──ingress.yaml
│     │  ├── frontend/
│     │  │  ├──ingress.yaml
└── site.yml          # Main playbook 
└── ansible.cfg           # Config options (optional)
```

---

## ✅ Sample Inventory (`inventory/hosts.ini`)

```ini
[bastion]
1.2.3.4 ansible_user=ubuntu

[app_nodes]
10.0.1.10 ansible_user=ubuntu
10.0.2.15 ansible_user=ubuntu

[all:vars]
ansible_ssh_private_key_file=~/.ssh/aws_login.pem
```

---

## 📘 Sample Playbook (`playbooks/site.yml`)

```yaml
- name: Configure app nodes
  hosts: app_nodes
  become: true  # Run as root
  roles:
    - docker
    - kubernetes
    - jenkins
```

---

## 🚀 steps followed
1. **Set up your inventory** (target machines)
2. **Create a base playbook**
3. Build **roles** to install:
    - Docker
    - Java
    - Kubernetes tools (kubelet, kubeadm, kubectl)
    - Jenkins
    - ArgoCD
4. Make sure Ansible connects through the **bastion/jump host**
