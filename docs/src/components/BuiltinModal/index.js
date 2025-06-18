import Modal from "@site/src/components/Modal";
import PlaygroundExample from "@site/src/components/PlaygroundExample";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import builtins from "@generated/builtin-data/default/builtins.json";

import styles from "./styles.module.css";
function BuiltinDisp() {
  return (
    <div
      className={styles.builtinDisp}
    >
      <span style={{ padding: ".5rem" }}>
        <h1>
          <code>io.jwt.encode_sign</code>
        </h1>
        <h2>
          <code>output := io.jwt.encode_sign(headers, payload, key)</code>
        </h2>
      </span>
      <span style={{ padding: ".3rem" }}>
        Encodes and optionally signs a JSON Web Token. <br />
        Inputs are taken as objects, not encoded strings (see io.jwt.encode_sign_raw). <br />
        <br />
        Arguments: <br />
        headers{": "}
        <code>
          (object[string: any])
        </code>{" "}
        :: JWS Protected Header<br />
        <br />
        payload{": "}
        <code>
          (object[string: any])
        </code>{" "}
        :: JWS Payload <br />
        <br />
        key{": "}
        <code>
          (object[string: any])
        </code>{" "}
        :: JSON Web Key (RFC7517)<br />
        <br />
        Returns:<br />
        output{": "}
        <code>
          (string)
        </code>{" "}
        :: signed JWT
      </span>
      <table style={{ border: "none" }}>
        <thead>
          <tr>
            <td>
              <h2 style={{ paddingTop: ".3rem" }}>Similar pages</h2>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span>Category: Token Signing</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>
                Token Signing: <code>io.jwt.encode_sign_raw</code>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function ExtraInfo() {
  return (
    <div className={styles.extraInfo}>
      <h2>Extra info</h2>
      <div>
        <p>
          <code>io.jwt.encode_sign()</code>{" "}
          takes three Rego Objects as parameters and returns their JWS Compact Serialization. This builtin should be
          used by those that want to use rego objects for signing during policy evaluation.
        </p>
        <blockquote>
          Note that with <code>io.jwt.encode_sign()</code>{"  "}
          the Rego objects are serialized to JSON with standard formatting applied whereas the{" "}
          <code>io.jwt.encode_sign_raw</code>{"  "}built-in will <b>not</b>{" "}
          affect whitespace of the strings passed in. This will mean that the final encoded token may have different
          string values, but the decoded and parsed JSON will match.
        </blockquote>

        <p>The following algorithms are supported:</p>
        <ul>
          <li>
            <code>ES256</code>: ECDSA using P-256 and SHA-256
          </li>
          <li>
            <code>ES384</code>: ECDSA using P-384 and SHA-384
          </li>
          <li>
            <code>ES512</code>: ECDSA using P-521 and SHA-512
          </li>
          <li>
            <code>HS256</code>: HMAC using SHA-256
          </li>
          <li>
            <code>HS384</code>: HMAC using SHA-384
          </li>
          <li>
            <code>HS512</code>: HMAC using SHA-512
          </li>
          <li>
            <code>PS256</code>: RSASSA-PSS using SHA256 and MGF1-SHA256
          </li>
          <li>
            <code>PS384</code>: RSASSA-PSS using SHA384 and MGF1-SHA384
          </li>
          <li>
            <code>PS512</code>: RSASSA-PSS using SHA512 and MGF1-SHA512
          </li>
          <li>
            <code>RS256</code>: RSASSA-PKCS-v1.5 using SHA-256
          </li>
          <li>
            <code>RS384</code>: RSASSA-PKCS-v1.5 using SHA-384
          </li>
          <li>
            <code>RS512</code>: RSASSA-PKCS-v1.5 using SHA-512
          </li>
        </ul>

        <blockquote>
          Note that the key{"'"}s provided should be base64 URL encoded (without padding) as per the specification{" "}
          <a href="https://tools.ietf.org/html/rfc7517">RFC7517</a>. This differs from the plain text secrets provided
          with the algorithm specific verify built-ins described below.
        </blockquote>
      </div>
    </div>
  );
}
function FunctionExamples() {
  return (
    <div className={styles.functionExamples}>
      <h2>Examples:</h2>
      <h4>Symmetric Key (HMAC with SHA-256):</h4>
      <div style={{ marginLeft: "2rem" }}>
        <PlaygroundExample dir={require.context("@site/docs/policy-reference/_examples/tokens/sign/hmac")} />
      </div>
      <h4>Symmetric Key with empty JSON payload:</h4>
      <div style={{ marginLeft: "2rem" }}>
        <PlaygroundExample
          dir={require.context("@site/docs/policy-reference/_examples/tokens/sign/empty_json")}
        />
      </div>
      <h4>RSA Key (RSA Signature with SHA-256):</h4>
      <div style={{ marginLeft: "2rem" }}>
        <PlaygroundExample dir={require.context("@site/docs/policy-reference/_examples/tokens/sign/rsa")} />
      </div>
    </div>
  );
}
function temp() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        maxHeight: "inherit",
      }}
    >
      {BuiltinDisp()}
      {ExtraInfo()}
      {FunctionExamples()}
    </div>
  );
}

export default function BuiltinModal({}) {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState(temp());
  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open</button>
      {showModal && <Modal content={content} setShowModal={setShowModal} />}
    </div>
  );
}
// if category
// |-------------------|----x
// |	fn1              | c1 |
// |	fn2              | c2 |
// |	fn3              | c3 |
// |-------------------|----|
//
// if fn
// |---------------|-------x
// |  fn:name 	   | c.fn1 |
// |  fn:sig  	   | c.fn2 |
// |  fn:desc 	   | c.fn3 |
// |  fn:meta 	   | c.fn4 |
// |---------------|-------|
