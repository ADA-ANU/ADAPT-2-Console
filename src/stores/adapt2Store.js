import { observable, action, computed, reaction, toJS } from "mobx";
import API_URL from "../config";
import PERMISSION_CATEGORY from "../permissionConfig";
import axios from "axios";
import { inject, observer } from "mobx-react";
import authStore from "./authStore";
import systemStore from "./systemStore";
import { notification } from "antd";
import React from "react";

export class adapt2Store {
  @observable selection = 1;
  @observable isLoading = false;
  @observable ShowFinalResult = false;
  @observable newFinalFiles = [];
  @observable newFileList = [];
  @observable newFormData = {};
  @observable existFinalFiles = [];
  @observable existFileList = [];
  @observable adapt2Ref = React.createRef();
  @observable createDataset = false;
  @observable doiServer = null;
  @observable doi = null;
  @observable sourceServer = null;
  @observable localSwitch = false;
  @observable remoteSwitch = false;
  @observable sourceURL = undefined;
  @observable inputSource = 1;
  @observable DSnFilesFormRef = null;
  @observable selectedADAFolder = undefined;
  @observable dvFormSelectedServer = undefined;
  @observable dvFormRef = React.createRef();
  @observable copyMetadata = false;
  @observable sourceMetadata = null;
  @observable isMetadataLoaading = false;
  @observable apiManagerVisible = false;
  @observable apiKeys = new Map();
  @observable isUpdating = false;
  // constructor() {
  //
  //     this.adapt2Ref = React.createRef();
  //
  // }
  scrollToMyRef = () => window.scrollTo(0, this.adapt2Ref.current.offsetTop);

  @action handleApiManagerVisible(val) {
    this.apiManagerVisible = val;
  }

  @action updateUserAPIs(apis) {
    const obj = {
      userid: authStore.currentUser.userID,
      apis: apis,
    };
    //const json = JSON.stringify(obj);
    this.isUpdating = true;
    axios
      .post(API_URL.updateUserAPI, obj, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(
        action((res) => {
          console.log(res.data);
          this.handleApiManagerVisible(false);
          this.openNotificationWithIcon2(
            "success",
            `Successfully updated your APIs.`
          );
          //systemStore.handleFinalResultOpen({}, res.data.msg.adaid)
          //this.adapt2Ref.scrollIntoView({behavior:'smooth'})
          //this.scrollToMyRef()
          //this.adapt2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      )
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          this.openNotificationWithIcon2(
            "error",
            `${err.response.data}, please refresh the page and retry.`
          );
        } else {
          this.openNotificationWithIcon2(
            "error",
            `${err}, please refresh the page and retry.`
          );
        }
      })
      .finally(
        action(() => {
          this.isUpdating = false;
        })
      );
  }
  @action updateCopyMetadata(value) {
    console.log("updateCopyMetadata", value);
    this.copyMetadata = value;
    if (value) {
      let userid = authStore.currentUser.userID;
      this.getDSInfoByDOI(this.doi, this.doiServer, userid);
      this.createDataset = true;
    } else {
      console.log("clearAdaFolderInfo");
      //systemStore.resetReturnedURL()
      systemStore.resetDVForm();
    }
  }

  @action getDSInfoByDOI(doi, server, userid) {
    const data = {
      doi: doi,
      server: server,
      userid: userid,
    };
    this.isMetadataLoaading = true;
    return axios
      .post(API_URL.Get_DSInfoByDOI, data)
      .then(
        action((res) => {
          console.log(res);
          systemStore.presetDVForm(res.data);
          // this.existingShellDS = true
          // this.adaFolderInfoErrorMsg = null
          // //console.log(res.data)
          // this.adaFolderInfo = res.data
          // this.returnedURL = res.data.url
          // adapt2Store.handleNewDatasetSwitch(false)
          // this.presetDVForm(res.data)
          // //console.log(res.data.adaFolderContent)
          // this.adaFolderFileList = res.data.adaFolderContent
          // this.detectDuplicateFiles(res.data.adaFolderContent, this.localTargetKeys)
        })
      )
      .catch(
        action((err) => {
          console.log(err);
          systemStore.resetDVForm();
          if (err.response) {
            console.log(err.response);
            if (err.response.status === 404) {
              console.log("404");
              this.adaFolderInfoErrorMsg = err.response.data.msg
                ? err.response.data.msg
                : "DOI not found";
              adapt2Store.handleNewDatasetSwitch(true);
            } else if (err.response.status === 401) {
              this.adaFolderInfoErrorMsg = "No permission to view";
              this.handleAPIInputErrorMsg(
                `Sorry, you don't have permission to view the content.`
              );
              this.handleAPIInputModal(true);
            } else if (err.response.status === 402) {
              console.log(err.response);
              this.adaFolderInfoErrorMsg = "No permission to view";
              let serverid = err.response.data.msg;
              this.popupInputModalByServerID(serverid);
            } else if (err.response.status === 405) {
              this.adaFolderInfoErrorMsg = "Server info not found";
            } else {
              this.adaFolderInfoErrorMsg = `Error, ${err.response.data.msg}`;
              // authStore.networkError = true
              // authStore.networkErrorMessage = err.response.data
            }
          }
        })
      )
      .finally(() => {
        setTimeout(() => {
          this.isMetadataLoaading = false;
        }, 1000);
      });
  }
  @action setDVFormServer(value) {
    this.dvFormSelectedServer = value;
    authStore.checkDataverseListStatus(authStore.newDVList, "dvForm");
  }
  @action adaFolderOnChange(value) {
    console.log(value);
    this.selectedADAFolder = value;
    if (value === undefined) {
      console.log("clearAdaFolderInfo");
      systemStore.resetReturnedURL();
      systemStore.resetDVForm();
      //systemStore.clearAdaFolderInfoErrorMsg()
      //this.fileFormRef.current.resetFields()
    } else {
      // this.fileFormRef.current.setFieldsValue({
      //     dataverse: undefined,
      //     doi: undefined
      // })
      //systemStore.clearAdaFolderInfoErrorMsg()
      let userid = authStore.currentUser.userID;
      systemStore.getDatasetInfoByADAID(value, userid);
    }
  }

  @action setSourceServer(server) {
    this.sourceServer = server;
  }
  @action setFormRef(ref) {
    this.DSnFilesFormRef = ref;
  }
  @action handleInputSourceChange(value) {
    this.inputSource = value;
    systemStore.fileList = [];
    systemStore.userUploadedFiles = [];
    systemStore.uploadedFiles = [];
    systemStore.sortedFileList.clear();
    systemStore.localSelectedKeys.clear();
    systemStore.remoteSelectedKeys.clear();
    systemStore.testCheck = [];
    systemStore.localCheckStatus.clear();
    systemStore.remoteCheckStatus.clear();
    systemStore.doiValid = false;
    if (this.copyMetadata) {
      systemStore.resetDVForm();
      this.createDataset = false;
      this.copyMetadata = false;
    }
    this.doiServer = null;
    this.sourceServer = null;
    this.doi = null;
    this.localSwitch = false;
    this.remoteSwitch = false;
    this.sourceURL = undefined;
    //this.copyMetadata = false
    if (this.DSnFilesFormRef) {
      this.DSnFilesFormRef.current.setFieldsValue({
        doi: undefined,
      });
    }
  }
  @action handleSourceURLInput(value) {
    this.sourceURL = value;
  }
  @action setDoiServer(server) {
    this.doiServer = server;
  }
  @action setDoi(doi) {
    this.doi = doi;
  }
  @action handleFileSwitch(value, ele) {
    if (ele === "local") {
      this.localSwitch = value;
    } else if (ele === "remote") {
      this.remoteSwitch = value;
    }
  }
  @action handleNewDatasetSwitch(value) {
    this.createDataset = value;
    if (!value) {
      this.remoteSwitch = false;
      systemStore.switchOff("remote");
      this.dvFormRef.current.resetFields();
      systemStore.handlePermission(true);
    }
  }
  @action SelectionOnChange(value) {
    this.selection = value;
    this.selectedADAFolder = undefined;
    this.resetAll();
    systemStore.resetAll();
  }
  @action resetSelection() {
    this.selection = undefined;
  }
  @action setSelection() {
    this.selection = 1;
  }
  @action resetAll() {
    this.createDataset = false;
    this.doiServer = null;
    this.doi = null;
    this.sourceServer = null;
    this.localSwitch = false;
    this.remoteSwitch = false;
    this.sourceURL = undefined;
    this.inputSource = 1;
    //this.DSnFilesFormRef = null
    this.selectedADAFolder = undefined;
    this.dvFormSelectedServer = undefined;
    this.copyMetadata = false;
  }
  @action handleSubmit(form) {
    if (this.selection === 1) {
      this.handleOption1Submit();
    } else if (this.selection === 2) {
      this.handleOption2Submit(form);
    } else if (this.selection === 3) {
      this.handleOption3Submit(form);
    }
  }
  @action handleOption1Submit() {
    console.log("submit");
    const obj = {
      newDataset: false,
      title: null,
      author: null,
      email: null,
      description: null,
      subject: null,
      server: null,
      dataverse: null,
      uploadSwitch: false,
      userid: authStore.currentUser.userID,
      type: "new",
    };
    const json = JSON.stringify(obj);
    this.isLoading = true;
    axios
      .post(API_URL.AdaID, json, {
        timeout: 1400000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(
        action((res) => {
          console.log(res.data);
          systemStore.handleFinalResultOpen({}, res.data.msg.adaid);
          //this.adapt2Ref.scrollIntoView({behavior:'smooth'})
          //this.scrollToMyRef()
          this.adapt2Ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        })
      )
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          this.openNotificationWithIcon(
            "error",
            "files",
            `${err.response.data}, please refresh the page and retry.`
          );
        } else {
          this.openNotificationWithIcon(
            "error",
            "files",
            `${err}, please refresh the page and retry.`
          );
        }
      })
      .finally(
        action(() => {
          this.isLoading = false;
        })
      );
  }

  @action handleOption2Submit(form) {
    console.log("option2 submitting");
    this.isLoading = true;
    systemStore.handleFinalResultClose();
    //const dataverse = this.dvFormSelectedServer
    const {
      server,
      title,
      dataverse,
      authorFields,
      email,
      description,
      subject,
      firstName,
      lastName,
    } = form;
    //const {fileList} = this.state;
    console.log(form);

    let obj = {};
    //let finalDemo = {}
    if (this.createDataset === false) {
      obj = {
        //doi: null,
        newDataset: false,
        title: null,
        author: null,
        email: null,
        description: null,
        subject: null,
        server: null,
        dataverse: null,
        localUploadSwitch: false,
        remoteUploadSwitch: false,
        userid: authStore.currentUser.userID,
      };
    } else {
      const dataverseID = dataverse;
      // let subjectIDs =[]
      // for(let sub of subject){
      //     subjectIDs.push(sub[1])
      // }
      obj = {
        //doi: doi,
        newDataset: this.createDataset,
        title: title,
        //author: author,
        author: `${lastName}, ${firstName}`,
        authorFields: authorFields,
        email: email,
        description: description,
        subject: subject,
        //subjectIDs
        server: server,
        dataverse: dataverseID,
        localUploadSwitch: this.localSwitch,
        remoteUploadSwitch: this.remoteSwitch,
        userid: authStore.currentUser.userID,
        copyMetadata: this.copyMetadata,
        sourceDOI: this.doi,
        sourceServer: this.doiServer,
      };
    }
    console.log(obj);
    const json = JSON.stringify(obj);

    axios
      .post(API_URL.AdaID, json, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((json) => {
        console.log(json);
        if (json.success === true) {
          console.log(json);
          console.log(this.doiServer);
          //this.setState({adaID: json.msg.adaid})
          const formData = new FormData();
          formData.set("adaid", json.msg.adaid);
          formData.set("userid", authStore.currentUser.userID);
          formData.set("datasetid", json.msg.dataset.id);
          formData.set("server", json.msg.dataverse);
          formData.set("localUploadSwitch", this.localSwitch);
          formData.set("remoteUploadSwitch", this.remoteSwitch);
          formData.set("newDataset", this.createDataset);
          formData.set("dataset", JSON.stringify(obj));
          formData.set("destinationDOI", json.msg.doi);
          formData.set("adaidExists", json.msg.adaidExists);
          formData.set("sourceDOI", this.sourceURL);
          formData.set("inputSource", this.inputSource);
          formData.set("sourceServer", this.doiServer);
          formData.set("copyMetadata", this.copyMetadata);
          formData.set(
            "localFileList",
            JSON.stringify(
              [...systemStore.localSelectedKeys.values()]
                .flat()
                .map((ele) => ele.filename)
            )
          );
          formData.set(
            "remoteFileList",
            JSON.stringify(
              [...systemStore.remoteSelectedKeys.values()]
                .flat()
                .map((ele) => ele.filename)
            )
          );

          systemStore.uploadedFiles.forEach((file) => {
            console.log(file);
            formData.append("file", file);
          });
          axios({
            url: API_URL.Option2Submission,
            method: "post",
            data: formData,
            config: {
              timeout: 1400000,
              headers: { "Content-Type": "multipart/form-data" },
            },
          })
            .then((res) => res.data)
            .then((data) => {
              console.log(data);
              //if (data.success === true) {
              console.log("recovering");
              //this.setState({returnedFiles: data.files})
              if (this.createDataset) {
                const datasetObj = {
                  datasetid: json.msg.dataset.id,
                  server: server,
                  userid: authStore.currentUser.userID,
                };
                const jsonData = JSON.stringify(datasetObj);
                axios
                  .post(API_URL.Get_DatasetInfo, jsonData, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((r) => r.data)
                  .then((info) => {
                    let doi = info.data.authority
                      ? info.data.authority + "/" + info.data.identifier
                      : null;

                    form["newDataset"] = this.createDataset;
                    if (this.copyMetadata) {
                      form["copyTool"] = true;
                    }
                    systemStore.handleFinalResultOpen(
                      form,
                      json.msg.adaid,
                      doi,
                      data.localFiles,
                      data.remoteFiles
                    );
                    //this.finalResult_New.scrollIntoView({behavior: 'smooth'})
                    this.adapt2Ref.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    this.isLoading = false;
                  })
                  .catch((err) => {
                    if (err.response) {
                      this.isLoading = false;
                      systemStore.handleFinalResultOpen(true);
                    }
                  });
              } else {
                this.isLoading = false;
                systemStore.handleFinalResultOpen(
                  form,
                  json.msg.adaid,
                  null,
                  data.localFiles
                );
                this.adapt2Ref.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                //this.finalResult_New.scrollIntoView({behavior: 'smooth'})
              }
            })
            .catch((err) => {
              console.log(err);
              this.isLoading = false;
              this.openNotificationWithIcon("error", "files", err);
            });
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);

          if (err.response.status === 401) {
            const servers = toJS(authStore.serverList);
            for (let serv of servers) {
              if (serv.alias === server) {
                systemStore.handleFailedAPI(serv.id, 2, err.response.data);
                systemStore.handleAPIInputModal(true);
              }
            }
          } else {
            this.openNotificationWithIcon(
              "error",
              "files",
              `${
                err.response.data ? err.response.data.msg : err
              }, please refresh the page and retry.`
            );
          }
        } else {
          this.openNotificationWithIcon(
            "error",
            "files",
            `${err}, please refresh the page and retry.`
          );
        }
        this.isLoading = false;
      });
  }

  @action handleOption3Submit(form) {
    console.log("option3 submitting");
    this.isLoading = true;
    systemStore.handleFinalResultClose();
    //const dataverse = this.dvFormSelectedServer
    const {
      server,
      title,
      dataverse,
      authorFields,
      email,
      description,
      subject,
      firstName,
      lastName,
    } = form;
    //const {fileList} = this.state;
    console.log(form);
    console.log(this.doiServer);
    let obj = {};
    if (this.createDataset && !systemStore.existingShellDS) {
      obj = {
        //doi: doi,
        newDataset: this.createDataset,
        title: title,
        //author: author,
        author: `${lastName}, ${firstName}`,
        authorFields: authorFields,
        email: email,
        description: description,
        subject: subject,
        //subjectIDs
        server: server,
        dataverse: dataverse,
        localUploadSwitch: this.localSwitch,
        remoteUploadSwitch: this.remoteSwitch,
        userid: authStore.currentUser.userID,
      };
    }
    //this.setState({adaID: json.msg.adaid})
    const formData = new FormData();
    formData.set("adaid", this.selectedADAFolder);
    formData.set("userid", authStore.currentUser.userID);
    //formData.set('datasetid', json.msg.dataset.id)
    formData.set("existingShellDS", systemStore.existingShellDS);
    formData.set("localUploadSwitch", this.localSwitch);
    formData.set("remoteUploadSwitch", this.remoteSwitch);
    formData.set("newDataset", this.createDataset);
    formData.set("dataset", JSON.stringify(obj));
    //formData.set('destinationDOI', json.msg.doi)
    formData.set("sourceDOI", this.sourceURL);
    formData.set("inputSource", this.inputSource);
    formData.set("sourceServer", this.doiServer);
    formData.set(
      "localFileList",
      JSON.stringify(
        [...systemStore.localSelectedKeys.values()]
          .flat()
          .map((ele) => ele.filename)
      )
    );
    formData.set(
      "remoteFileList",
      JSON.stringify(
        [...systemStore.remoteSelectedKeys.values()]
          .flat()
          .map((ele) => ele.filename)
      )
    );

    systemStore.uploadedFiles.forEach((file) => {
      console.log(file);
      formData.append("file", file);
    });
    axios({
      url: API_URL.Option3Submission,
      method: "post",
      data: formData,
      config: {
        timeout: 1400000,
        headers: { "Content-Type": "multipart/form-data" },
      },
    })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        //if (data.success === true) {
        console.log("recovering");
        //this.setState({returnedFiles: data.files})
        if (this.createDataset) {
          const datasetObj = {
            datasetid: data.datasetid,
            server: server,
            userid: authStore.currentUser.userID,
          };
          const jsonData = JSON.stringify(datasetObj);
          axios
            .post(API_URL.Get_DatasetInfo, jsonData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((r) => r.data)
            .then((info) => {
              console.log(info);
              let doi = info.data.authority
                ? info.data.authority + "/" + info.data.identifier
                : null;

              form["newDataset"] = this.createDataset;
              systemStore.handleFinalResultOpen(
                form,
                this.selectedADAFolder,
                doi,
                data.localFiles,
                data.remoteFiles
              );
              console.log("scroll");
              this.adapt2Ref.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              this.isLoading = false;
            })
            .catch((err) => {
              if (err.response) {
                this.isLoading = false;
                systemStore.handleFinalResultOpen(true);
              }
            });
        } else {
          this.isLoading = false;
          systemStore.handleFinalResultOpen(
            {
              datasetURL: systemStore.returnedURL
                ? systemStore.returnedURL
                : null,
            },
            this.selectedADAFolder,
            null,
            data.localFiles,
            data.remoteFiles
          );
          //this.finalResult_New.scrollIntoView({behavior: 'smooth'})
          //this.adapt2Ref.scrollIntoView({behavior: 'smooth'})
          this.adapt2Ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          //this.scrollToMyRef()
        }
      })
      .catch((err) => {
        this.isLoading = false;
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          this.openNotificationWithIcon(
            "error",
            "files",
            `${err.response.data}, please refresh the page and retry.`
          );
        } else {
          this.openNotificationWithIcon(
            "error",
            "files",
            `${err}, please refresh the page and retry.`
          );
        }
      });
    // .catch(err => {
    // console.log(err)
    // this.isLoading = false
    // this.openNotificationWithIcon('error', 'files', err)
    // })
  }
  openNotificationWithIcon2 = (type, msg) => {
    if (type === "success") {
      notification[type]({
        message: "Successful",
        description: msg,
      });
    } else {
      notification[type]({
        message: "Submission Failed",
        description: msg,
        duration: 0,
      });
    }
  };
  openNotificationWithIcon = (type, fileName, error) => {
    if (type === "success") {
      notification[type]({
        message: "Successful",
        description: `You have successfully uploaded file ${fileName}`,
      });
    } else {
      notification[type]({
        message: "Submission Failed",
        description: `${error}`,
        duration: 0,
      });
    }
  };
}

export default new adapt2Store();
