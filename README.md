# superapp-infra

Pulumi program deploying [superapp](../superapp) to Kubernetes. Sample IaC repo for Ops-Crew: the memory limit lives in `Pulumi.<stack>.yaml` and `index.ts`, which is what Ops-Crew's pull requests change.

```sh
npm install
export PULUMI_BACKEND_URL=file://$PWD/.pulumi   # local state; or `pulumi login` to your backend
export PULUMI_CONFIG_PASSPHRASE=''
pulumi stack select dev --create
pulumi up --yes
```

Config keys: `kubeContext` (required, pins the cluster), `image`, `memoryLimit`, `cpuLimit`.
