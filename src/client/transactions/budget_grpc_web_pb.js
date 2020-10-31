/**
 * @fileoverview gRPC-Web generated client stub for budget
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!

/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js')
const proto = {};
proto.budget = require('./budget_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.budget.BudgetServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.budget.BudgetServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.budget.Transaction,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_BudgetService_AddTransaction = new grpc.web.MethodDescriptor(
  '/budget.BudgetService/AddTransaction',
  grpc.web.MethodType.UNARY,
  proto.budget.Transaction,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.budget.Transaction} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.budget.Transaction,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_BudgetService_AddTransaction = new grpc.web.AbstractClientBase.MethodInfo(
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.budget.Transaction} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.budget.Transaction} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.budget.BudgetServiceClient.prototype.addTransaction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/budget.BudgetService/AddTransaction',
      request,
      metadata || {},
      methodDescriptor_BudgetService_AddTransaction,
      callback);
};


/**
 * @param {!proto.budget.Transaction} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.budget.BudgetServicePromiseClient.prototype.addTransaction =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/budget.BudgetService/AddTransaction',
      request,
      metadata || {},
      methodDescriptor_BudgetService_AddTransaction);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.google.protobuf.Empty,
 *   !proto.budget.ListCategoriesResponse>}
 */
const methodDescriptor_BudgetService_ListCategories = new grpc.web.MethodDescriptor(
  '/budget.BudgetService/ListCategories',
  grpc.web.MethodType.UNARY,
  google_protobuf_empty_pb.Empty,
  proto.budget.ListCategoriesResponse,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.budget.ListCategoriesResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.google.protobuf.Empty,
 *   !proto.budget.ListCategoriesResponse>}
 */
const methodInfo_BudgetService_ListCategories = new grpc.web.AbstractClientBase.MethodInfo(
  proto.budget.ListCategoriesResponse,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.budget.ListCategoriesResponse.deserializeBinary
);


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.budget.ListCategoriesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.budget.ListCategoriesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.budget.BudgetServiceClient.prototype.listCategories =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/budget.BudgetService/ListCategories',
      request,
      metadata || {},
      methodDescriptor_BudgetService_ListCategories,
      callback);
};


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.budget.ListCategoriesResponse>}
 *     Promise that resolves to the response
 */
proto.budget.BudgetServicePromiseClient.prototype.listCategories =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/budget.BudgetService/ListCategories',
      request,
      metadata || {},
      methodDescriptor_BudgetService_ListCategories);
};


module.exports = proto.budget;

