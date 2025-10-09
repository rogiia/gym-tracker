# Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Gym Tracker application.

## Prerequisites

- Kubernetes cluster (1.19+)
- kubectl configured to access your cluster
- Docker registry (optional, for remote deployments)

## Files

- **persistentvolumeclaim.yaml** - PVC for SQLite database storage
- **deployment.yaml** - Application deployment
- **service.yaml** - ClusterIP service for internal access
- **ingress.yaml** - Optional ingress for external access

## Deployment Steps

### 1. Build and Push Docker Image

Build the Docker image:
```bash
docker build -t gym-tracker:latest .
```

If deploying to a remote cluster, tag and push to your registry:
```bash
docker tag gym-tracker:latest your-registry/gym-tracker:latest
docker push your-registry/gym-tracker:latest
```

Update the image name in `deployment.yaml` accordingly.

### 2. Deploy to Kubernetes

Apply all manifests:
```bash
kubectl apply -f kubernetes/
```

Or apply individually in order:
```bash
kubectl apply -f kubernetes/persistentvolumeclaim.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
# Optional: kubectl apply -f kubernetes/ingress.yaml
```

### 3. Verify Deployment

Check the deployment status:
```bash
kubectl get pods -l app=gym-tracker
kubectl get svc gym-tracker
kubectl get pvc gym-tracker-data
```

View logs:
```bash
kubectl logs -l app=gym-tracker -f
```

### 4. Access the Application

#### Port Forward (for testing)
```bash
kubectl port-forward svc/gym-tracker 8080:80
```
Then access at http://localhost:8080

#### Using Ingress (for production)
1. Ensure an Ingress controller is installed in your cluster
2. Update the host in `ingress.yaml` with your domain
3. Apply the ingress: `kubectl apply -f kubernetes/ingress.yaml`
4. Access at http://your-domain.com

#### Using LoadBalancer
Change the service type in `service.yaml` from `ClusterIP` to `LoadBalancer`:
```yaml
spec:
  type: LoadBalancer
```
Then get the external IP:
```bash
kubectl get svc gym-tracker
```

## Configuration

### Storage

The default PVC requests 1Gi of storage. Adjust in `persistentvolumeclaim.yaml`:
```yaml
resources:
  requests:
    storage: 5Gi  # Increase as needed
```

### Replicas

The application uses SQLite, which is file-based. Keep replicas at 1 to avoid database locking issues:
```yaml
spec:
  replicas: 1
```

For high availability, consider migrating to PostgreSQL or MySQL.

### Resources

Adjust resource limits in `deployment.yaml` based on your needs:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## Backup

To backup the SQLite database:
```bash
kubectl exec -it <pod-name> -- sqlite3 /app/data/gym-tracker.db ".backup /app/data/backup.db"
kubectl cp <pod-name>:/app/data/backup.db ./backup.db
```

## Troubleshooting

### Pod not starting
```bash
kubectl describe pod -l app=gym-tracker
kubectl logs -l app=gym-tracker
```

### Database issues
Check volume mount:
```bash
kubectl exec -it <pod-name> -- ls -la /app/data
```

### Health check failures
Test health endpoint:
```bash
kubectl exec -it <pod-name> -- wget -O- http://localhost/health
```

## Cleanup

Remove all resources:
```bash
kubectl delete -f kubernetes/
```

**Warning:** This will delete the PVC and all data. Backup first if needed.
