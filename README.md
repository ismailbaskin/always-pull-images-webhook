## Deploy Cloud Function
```
gcloud beta functions deploy alwaysPullImages --trigger-http
```

```
HTTPS_TRIGGER_URL=$(gcloud beta functions describe alwaysPullImages \
  --format 'value(httpsTrigger.url)')
```

## Download Global Sign Certificate
```
curl http://secure.globalsign.com/cacert/rootr2cross.crt -o ca.crt
openssl x509 -in ca.crt -inform der -outform pem -out cert.pem
```


## Create Mutating Webhook Admission Object
```
cat <<EOF | kubectl apply --dry-run -f -
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
metadata:
  name: always-pull-images
webhooks:
  - name: always-pull-images.ismailbaskin.com
    rules:
      - apiGroups:
          - ""
        apiVersions:
          - v1
        operations:
          - CREATE
          - UPDATE
        resources:
          - pods
    failurePolicy: Fail
    clientConfig:
      url: "${HTTPS_TRIGGER_URL}"
      caBundle: $(base64 cert.pem)
EOF
```
