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

## Stacks

One stack per cluster: `prod` deploys to `kind-clu-prod` (cluster `clu-prod`), `dev` to `kind-clu-dev` (cluster `clu-dev`). Each stack sets `kubeContext`, `cluster`, `image` and `memoryLimit`; the program labels the namespace with `ops-crew.io/cluster`.

## Clusters

The clusters themselves are defined in `clusters/`: one kind configuration per cluster (`kind-clu-prod.yml`, `kind-clu-dev.yml`), created with `kind create cluster --config`. This is the infrastructure code for the Kubernetes Clusters, as the Pulumi program is for superapp.
