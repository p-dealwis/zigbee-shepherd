/* jshint node: true */
'use strict';
var _ = require('busyman');

// devInfo = { type, ieeeAddr, nwkAddr, manufId, epList }
function Device(devInfo) {
    this._controller = null;
    this._id = null;

    this._net = {
        type: devInfo.type,
        ieeeAddr: devInfo.ieeeAddr,
        nwkAddr: devInfo.nwkAddr,
        status: 'offline',
        joinTime: null
    };

    this.manufId = devInfo.manufId;
    this.epList = devInfo.epList;
    this.endpoints = [];    // dev.registerEp();
}

/*************************************************************************************************/
/*** Public APIs                                                                               ***/
/*************************************************************************************************/
Device.prototype.dump = function () {
    var dumpOfEps = [];

    this.endpoints.forEach(function (ep) {
        dumpOfEps.push(ep.dump());
    });

    return {
        net: _.cloneDeep(this._net),
        manufId: this.manufId,
        joinTime: this.joinTime,
        numEndpoints: this.epList.length,
        epList: _.cloneDeep(this.epList),
        endpoints: dumpOfEps,
    };
};

Device.prototype.getEndpoint = function (epId) {
    return this.endpoints.find(function (ep) {
        return ep.getEpId() === epId;
    });
};

Device.prototype.isRegistered = function () {
    return !_.isNil(this._id) && this._getController();
};

Device.prototype.addEndpoint = function (ep) {
    var added = false;

    if (!this.getEndpoint(ep.getEpId())) {
        this.endpoints.push(ep);
        added = true;
    }

    return added;
};

Device.prototype.getIeeeAddr = function () {
    return this._net.ieeeAddr;
};

Device.prototype.getNwkAddr = function () {
    return this._net.nwkAddr;
};

Device.prototype.getStatus = function () {
    return this._net.status;
};

Device.prototype.getManufId = function () {
    return this._net.manufId;
};

Device.prototype._getController = function () {
    return this._controller;
};

Device.prototype._setController = function (cntl) {
    this._controller = cntl;
    return this;
};

/*************************************************************************************************/
/*** Protected Methods                                                                         ***/
/*************************************************************************************************/
Device.prototype._notReadyEndpoints = function () {
    var self = this,
        epsNotReady = [];

    this.epList.forEach(function (epId) {
        if (!self.getEndpoint(epId))
            epsNotReady.push(epId);
    });

    return epsNotReady;
};

Device.prototype.getNetInfo = function () {
    return _.cloneDeep(this._net);
};

Device.prototype.setNetInfo = function () {
};

// Device.prototype.restore = function () {};
// Device.prototype.getCluster = function () {};


// Device.prototype.bindEp = function () {};
// Device.prototype.enableLifeChecker = function () {};
// Device.prototype.disableLifeChecker = function () {};
// Device.prototype.dbRead = function () {};
// Device.prototype.dbSave = function () {};
// Device.prototype.dbRemove = function () {};
// Device.prototype.replaceEp = function () {};
// Device.prototype.updateEp = function () {};
// Device.prototype.updateCluster = function () {};
// Device.prototype.updateAttrs = function () {};

// Device.prototype._addClst = function (epId, dir, cluster) {
//     var ep = this.findEp(epId);
//     ep.addCluster(dir, cluster);
// };

// Device.prototype._addAttrToClst = function (epId, cId, attr) {};


/*************************************************************************************************/
/*** Remote                                                                                    ***/
/*************************************************************************************************/
// MAC: dataReq, disassociateReq
// AF: dataRequest, dataRequestExt, dataRequestSrcRtg
// ZDO: nwkAddrReq, ieeeAddrReq, nodeDescReq, powerDescReq, ... many
// SAPI: permitJoiningRequest, bindDevice, sendDataRequest

// Device.prototype.nwkAddrReq = function () {};
// Device.prototype.readAttrReq = function () {};
// Device.prototype.routeTableReq = function () {};