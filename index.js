'use strict';

exports.alwaysPullImages = (req, res) => {

  const { containers, initContainers } = req.body.request.object.spec;

  const containersPatches = (containers || []).map((container, i) => ({
    'op': 'replace',
    'path': `/spec/containers/${i}/imagePullPolicy`,
    'value': 'Always'
  }));
  const initContainersPatches = (initContainers || []).map((container, i) => ({
    'op': 'replace',
    'path': `/spec/initContainers/${i}/imagePullPolicy`,
    'value': 'Always'
  }));

  const admissionReview = {
    response: {
      allowed: true,
      patch: Buffer.from(JSON.stringify(
        containersPatches.concat(initContainersPatches)
      )).toString('base64'),
      patchType: 'JSONPatch'
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(admissionReview));
  res.status(200).end();
};
