import React, { Component, useState } from "react";
import API_URL from "../../config";
import "antd/es/spin/style/css";
import {
  Result,
  Button,
  Typography,
  Form,
  Input,
  Popover,
  Modal,
  Collapse,
  Tag,
  List,
  Descriptions,
  Badge,
  Row,
  Col,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import axios from "axios";
const { Panel } = Collapse;
const { Paragraph, Text } = Typography;

@inject("routingStore", "systemStore", "authStore", "adapt2Store")
@observer
export default class FinalResult extends Component {
  handleCloseFinalResult = () => {
    this.props.systemStore.handleFinalResultClose();
    if (this.props.clearResult) {
      this.props.clearResult();
    }
  };
  render() {
    const {
      systemStore,
      authStore,
      adapt2Store,
      destinationDOIOnChange,
    } = this.props;
    //dataset, adaid, files, doi
    const dataset = systemStore.finalResultDataset;
    const adaid = systemStore.finalResultAdaid;
    const doi = systemStore.finalResultDOI;
    //const files = systemStore.finalResultFiles
    const localFiles = systemStore.finalResultLocalFiles;
    const remoteFiles = systemStore.finalResultRemoteFiles;
    const {
      server,
      dataverse,
      title,
      firstName,
      lastName,
      authorFields,
      email,
      description,
      subject,
      uploadSwitch,
      newDataset,
      datasetURL,
      metaData,
      copyTool,
      file,
      remotePath,
      localPath,
    } = dataset;
    console.log(remoteFiles);
    const serverList = toJS(authStore.serverList);
    const successList = remoteFiles
      ? !adapt2Store.selection
        ? remoteFiles.filter((ele) => ele.status === "success")
        : remoteFiles
      : undefined;
    const failList = remoteFiles
      ? remoteFiles.filter((ele) => ele.status === "failed")
      : undefined;
    let data = [];
    let serverURL = null;
    console.log(successList);
    for (let serve of serverList) {
      if (serve.alias === server) {
        serverURL = serve.url;
      }
    }
    const url =
      doi !== null &&
      doi !== undefined &&
      serverURL !== null &&
      serverURL !== undefined
        ? serverURL + "dataset.xhtml?persistentId=doi:" + doi
        : null;

    if (newDataset) {
      data.push({
        title: "Server",
        result: server ? server.toUpperCase() : "",
      });
      data.push({ title: "Dataverse", result: dataverse ? dataverse[0] : "" });
      data.push({ title: "Title", result: title ? title : "" });
      data.push({
        title: "Authors",
        result:
          firstName && lastName
            ? authorFields
              ? `${lastName}, ${firstName}` +
                "; " +
                authorFields
                  .map((field) => `${field.lastName}, ${field.firstName}`)
                  .join("; ")
              : `${lastName}, ${firstName}`
            : "",
      });
      data.push({ title: "Email", result: email ? email : "" });
      data.push({
        title: "Description",
        result: description ? description : "",
      });
      data.push({
        title: "Subjects",
        result: subject
          ? subject.map((sub) => (
              <Tag key={sub} color="success">
                {sub}
              </Tag>
            ))
          : "",
      });
    }

    return (
      // <Modal
      //     visible={systemStore.showfinalResult}
      //     maskClosable={false}
      //     closable={false}
      //     centered
      //     footer={null}
      //     width='30%'
      // >
      <div id="finalResult">
        <Result
          status={failList && failList.length > 0 ? "warning" : "success"}
          title={
            failList && failList.length > 0
              ? `${failList.length} ${
                  failList.length > 1 ? "files" : "file"
                } failed to be uploaded`
              : "Submission Successful"
          }
          subTitle="Please check your submission details below."
          // extra={[
          //     <Button type="primary" key="console" onClick={this.handleCloseFinalResult}>
          //         OK
          //     </Button>
          // ]}
        >
          <div className="desc">
            {adaid ? (
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>ADAID:</Text>{" "}
                  {adaid ? adaid : ""}
                </Text>
              </Paragraph>
            ) : null}

            {datasetURL ? (
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  Dataset Link:{" "}
                  <a href={datasetURL} target="_blank">
                    Click Here
                  </a>
                </Text>
              </Paragraph>
            ) : null}
            {remotePath ? (
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  Dataset Link:{" "}
                  <a href={remotePath} target="_blank">
                    Click Here
                  </a>
                </Text>
              </Paragraph>
            ) : null}
            {localPath ? (
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  File Location: {localPath}
                </Text>
              </Paragraph>
            ) : null}

            {copyTool && copyTool === true ? (
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                  mark
                >
                  Please note that the new dataset doesn't come with the
                  guestbook or the restriction data of the source dataset and
                  therefore user might need to add them to the destination
                  dataset manually on Dataverse.
                </Text>
              </Paragraph>
            ) : null}
            {newDataset ? (
              <>
                <Paragraph>
                  Dataset Link:{" "}
                  {doi !== null && doi !== undefined ? (
                    <a href={url} target="_blank">
                      Click Here
                    </a>
                  ) : (
                    "Failed to get the link."
                  )}
                </Paragraph>
                <Paragraph>Dataset DOI: {doi}</Paragraph>
                <Paragraph>Dataset Status: Draft</Paragraph>

                <Collapse>
                  <Panel header="Dataset information" key="1">
                    <Descriptions
                      //title="Responsive Descriptions"
                      bordered
                      layout="vertical"
                      //column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    >
                      {data.map((item) => (
                        <Descriptions.Item key={item.title} label={item.title}>
                          {item.result}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </Panel>
                </Collapse>
              </>
            ) : null}
            {metaData && metaData === true ? (
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  Metadata created
                </Text>
              </Paragraph>
            ) : null}

            <Paragraph>
              {/*<CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet*/}
              {/*eligible to apply <a>Apply Unlock &gt;</a>*/}
              <ol>
                {localFiles && localFiles.length > 0 ? (
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                    }}
                  >
                    <div style={{ paddingBottom: "2vh", paddingTop: "2vh" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Preserved File List:
                      </Text>
                    </div>
                  </Text>
                ) : (
                  ""
                )}
                {localFiles && localFiles.length > 0
                  ? localFiles.map((file, index) => {
                      let beforePath = file.path.split("/")[1];
                      let afterPath = `./${beforePath}/${file.originalname}`;
                      return (
                        <li key={index}>
                          <p>{file.originalname}</p>
                          <p>{`Path: ${afterPath}`}</p>
                        </li>
                      );
                    })
                  : ""}
              </ol>
              <br />
              <ol>
                {(successList && successList.length > 0) ||
                (failList && failList.length > 0) ? (
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                    }}
                  >
                    <div style={{ paddingBottom: "2vh", paddingTop: "2vh" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Curated File List:
                      </Text>
                    </div>
                  </Text>
                ) : (
                  ""
                )}
                {successList && successList.length > 0
                  ? successList.map((file, index) => {
                      return (
                        <li key={index}>
                          <p>{adapt2Store.selection ? file : file.filename}</p>
                        </li>
                      );
                    })
                  : ""}
              </ol>
              <ol>
                {failList && failList.length > 0 ? (
                  <>
                    <Row align="middle">
                      <Col span={5}>
                        <Text
                          strong
                          style={{
                            fontSize: 16,
                          }}
                        >
                          <div
                            style={{ paddingBottom: "2vh", paddingTop: "2vh" }}
                          >
                            <Text style={{ fontWeight: "bold" }}>
                              Uploading failed:
                            </Text>
                          </div>
                        </Text>
                      </Col>
                      <Col span={5} offset={1}>
                        <Button
                          danger
                          onClick={() => {
                            systemStore.copyToolRetry(failList, datasetURL);
                            if (destinationDOIOnChange) {
                              let e = {
                                target: {
                                  value: datasetURL,
                                },
                              };
                              destinationDOIOnChange(e);
                            }
                          }}
                        >
                          Retry
                        </Button>
                      </Col>
                    </Row>
                    {failList.map((file, index) => {
                      return (
                        <li key={index}>
                          <Text
                            mark
                            style={{
                              fontSize: 14,
                            }}
                          >
                            {file.filename} ({file.msg})
                          </Text>
                        </li>
                      );
                    })}
                  </>
                ) : (
                  ""
                )}
              </ol>
            </Paragraph>
          </div>
        </Result>
      </div>

      // </Modal>
    );
  }
}
