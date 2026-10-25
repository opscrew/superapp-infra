import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
// The kube context is required so this program can never land on whatever context kubectl happens to point at.
const kubeContext = config.require("kubeContext");
const image = config.get("image") ?? "ghcr.io/your-throwaway-org/superapp:latest";
const memoryLimit = config.get("memoryLimit") ?? "128Mi";
const cpuLimit = config.get("cpuLimit") ?? "200m";

const provider = new k8s.Provider("kind", { context: kubeContext });

const ns = new k8s.core.v1.Namespace("superapp", { metadata: { name: "superapp" } }, { provider });

const labels = { app: "superapp" };

const deployment = new k8s.apps.v1.Deployment(
  "superapp",
  {
    metadata: { name: "superapp", namespace: ns.metadata.name, labels },
    spec: {
      replicas: 1,
      selector: { matchLabels: labels },
      template: {
        metadata: { labels },
        spec: {
          containers: [
            {
              name: "superapp",
              image,
              imagePullPolicy: image.startsWith("ghcr.io/") ? "Always" : "IfNotPresent",
              ports: [{ containerPort: 8080, name: "http" }],
              env: [{ name: "APP_VERSION", value: "1.0.0" }],
              resources: {
                requests: { cpu: "50m", memory: "32Mi" },
                limits: { cpu: cpuLimit, memory: memoryLimit },
              },
              readinessProbe: { httpGet: { path: "/healthz", port: "http" }, periodSeconds: 5 },
            },
          ],
        },
      },
    },
  },
  { provider },
);

const service = new k8s.core.v1.Service(
  "superapp",
  {
    metadata: { name: "superapp", namespace: ns.metadata.name, labels },
    spec: { selector: labels, ports: [{ port: 80, targetPort: "http", name: "http" }] },
  },
  { provider },
);

export const namespace = ns.metadata.name;
export const deploymentName = deployment.metadata.name;
export const serviceName = service.metadata.name;
