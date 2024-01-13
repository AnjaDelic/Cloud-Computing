#!/bin/bash

directory_path="/Users/anjadelic/Desktop/Cloud-Computing/k8s/persistent-volume/"

# Iterirajte kroz sve YAML fajlove u direktorijumu
for file in "$directory_path"*.yaml; do
  echo "Applying $file"
  kubectl apply -f "$file"
done

directory_path="/Users/anjadelic/Desktop/Cloud-Computing/k8s/persistent-volume-claims/"

# Iterirajte kroz sve YAML fajlove u direktorijumu
for file in "$directory_path"*.yaml; do
  echo "Applying $file"
  kubectl apply -f "$file"
done

echo "All volumes and volume mounts applied successfully."

# Postavite putanju do direktorijuma sa YAML fajlovima
directory_path="/Users/anjadelic/Desktop/Cloud-Computing/k8s/services/"

# Iterirajte kroz sve YAML fajlove u direktorijumu
for file in "$directory_path"*.yaml; do
  echo "Applying $file"
  kubectl apply -f "$file"
done

echo "All services applied successfully."

# Postavite putanju do direktorijuma sa YAML fajlovima
directory_path="/Users/anjadelic/Desktop/Cloud-Computing/k8s/deployments/"

# Iterirajte kroz sve YAML fajlove u direktorijumu
for file in "$directory_path"*.yaml; do
  echo "Applying $file"
  kubectl apply -f "$file"
done

echo "All deployments applied successfully."

kubectl apply -f "/Users/anjadelic/Desktop/Cloud-Computing/k8s/ingress.yaml"
