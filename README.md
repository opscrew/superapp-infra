# superapp-infra

Kubernetes manifests deploying [superapp](../superapp), with Kustomize. Sample infrastructure repository for OpsCrew: `base/` holds what every environment shares, and `overlays/prod/` what prod sets, such as superapp's memory limit in `overlays/prod/resources.yml`, which is what OpsCrew's pull requests change.

```sh
kubectl kustomize overlays/prod   # what prod gets
```

## Deploying

Argo CD in OpsCrew's preview environment (`deploy/preview/preview.sh` in the OpsCrew repository) syncs `overlays/prod` on `main` into the preview's kind cluster, which OpsCrew knows as the Kubernetes Cluster `clu-prod`: automatically, with prune, within a minute of a merge. Self-heal is off, so a change made in the cluster by hand stays until the next sync. The image is `superapp:dev`, built and loaded into the cluster by `preview.sh apps`.
