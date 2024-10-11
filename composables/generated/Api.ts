/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginBodyDto {
  username: string;
  password: string;
}

export interface LoginSuccessDto {
  success: boolean;
  token: string;
}

export interface LoginErrorDto {
  success: boolean;
  message: string;
}

export interface SignupRequestDto {
  username: string;
  password: string;
  email: string;
}

export interface SignupResponseDto {
  success: boolean;
  message: string;
  user: object;
}

export interface UserResponseDto {
  id: number;
  email: string;
  username: string;
  preferences: string[];
}

export interface UserEventsSuggestionsResponseDto {
  success: boolean;
  suggestions: string[];
}

export interface UpdatePasswordRequestDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserUpdateResponseDto {
  success: boolean;
  message?: string;
}

export interface UpdateEmailRequestDto {
  email: string;
}

export interface UpdatePreferencesRequestDto {
  preferences: string[];
}

export type ObjectId = object;

export interface EventResponseDto {
  _id: ObjectId;
  name: string;
  description: string;
  type: string;
  /** @format date-time */
  startDate: string;
  /** @format date-time */
  endDate: string;
  tags: string[];
}

export interface CreateEventDto {
  name: string;
  description: string;
  type: string;
  /** @format date-time */
  startDate: string;
  /** @format date-time */
  endDate: string;
  tags: string[];
}

export interface EditEventDto {
  name: string;
  description: string;
  type: string;
  /** @format date-time */
  startDate: string;
  /** @format date-time */
  endDate: string;
  tags: string[];
}

export interface CreateParticipationDto {
  eventId: ObjectId;
}

export type UserEntity = object;

export type EventEntity = object;

export interface ParticipationResponseDto {
  id: ObjectId;
  user: UserEntity;
  event: EventEntity;
  status: string;
  message?: string;
  passkitToken?: string;
}

export interface RequestParticipationDto {
  eventId: ObjectId;
  message: string;
}

export interface AcceptParticipationRequestDto {
  eventId: ObjectId;
  participationId: ObjectId;
}

export interface RejectParticipationRequestDto {
  eventId: ObjectId;
  participationId: ObjectId;
}

export interface CancelParticipationRequestDto {
  eventId: ObjectId;
  participationId: ObjectId;
}

export type Buffer = object;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title Evently API
 * @version 1.0
 * @contact
 *
 * The Evently backend API description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerSignIn
     * @request POST:/auth/login
     */
    authControllerSignIn: (data: LoginBodyDto, params: RequestParams = {}) =>
      this.request<LoginSuccessDto, LoginErrorDto>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerSignUp
     * @request POST:/auth/signup
     */
    authControllerSignUp: (data: SignupRequestDto, params: RequestParams = {}) =>
      this.request<SignupResponseDto, any>({
        path: `/auth/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name UserControllerGetUserInfos
     * @request GET:/user
     * @secure
     */
    userControllerGetUserInfos: (params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/user`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerGetUserSuggestions
     * @request GET:/user/suggestions
     * @secure
     */
    userControllerGetUserSuggestions: (params: RequestParams = {}) =>
      this.request<UserEventsSuggestionsResponseDto, any>({
        path: `/user/suggestions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerUpdatePassword
     * @request PATCH:/user/updatePassword
     * @secure
     */
    userControllerUpdatePassword: (data: UpdatePasswordRequestDto, params: RequestParams = {}) =>
      this.request<UserUpdateResponseDto, any>({
        path: `/user/updatePassword`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerUpdateEmail
     * @request PATCH:/user/updateEmail
     * @secure
     */
    userControllerUpdateEmail: (data: UpdateEmailRequestDto, params: RequestParams = {}) =>
      this.request<UserUpdateResponseDto, any>({
        path: `/user/updateEmail`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerUpdatePreferences
     * @request PATCH:/user/updatePreferences
     * @secure
     */
    userControllerUpdatePreferences: (data: UpdatePreferencesRequestDto, params: RequestParams = {}) =>
      this.request<UserUpdateResponseDto, any>({
        path: `/user/updatePreferences`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerDeleteAccount
     * @request DELETE:/user/deleteAccount
     * @secure
     */
    userControllerDeleteAccount: (params: RequestParams = {}) =>
      this.request<UserUpdateResponseDto, any>({
        path: `/user/deleteAccount`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  event = {
    /**
     * No description
     *
     * @tags Event
     * @name EventControllerGetAllUserEvents
     * @request GET:/event
     * @secure
     */
    eventControllerGetAllUserEvents: (params: RequestParams = {}) =>
      this.request<EventResponseDto[], any>({
        path: `/event`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventControllerCreateEvent
     * @request POST:/event
     * @secure
     */
    eventControllerCreateEvent: (data: CreateEventDto, params: RequestParams = {}) =>
      this.request<EventResponseDto, any>({
        path: `/event`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventControllerGetEvent
     * @request GET:/event/{eventId}
     * @secure
     */
    eventControllerGetEvent: (eventId: string, params: RequestParams = {}) =>
      this.request<EventResponseDto, any>({
        path: `/event/${eventId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventControllerEditEvent
     * @request PUT:/event/{eventId}
     * @secure
     */
    eventControllerEditEvent: (eventId: string, data: EditEventDto, params: RequestParams = {}) =>
      this.request<EventResponseDto, any>({
        path: `/event/${eventId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventControllerDeleteEvent
     * @request DELETE:/event/{eventId}
     * @secure
     */
    eventControllerDeleteEvent: (eventId: string, params: RequestParams = {}) =>
      this.request<EventResponseDto, any>({
        path: `/event/${eventId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventControllerSearchEvents
     * @request GET:/event/search/{name}
     * @secure
     */
    eventControllerSearchEvents: (name: string, params: RequestParams = {}) =>
      this.request<EventResponseDto[], any>({
        path: `/event/search/${name}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  participation = {
    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerCreateParticipation
     * @request POST:/participation
     * @secure
     */
    participationControllerCreateParticipation: (data: CreateParticipationDto, params: RequestParams = {}) =>
      this.request<ParticipationResponseDto, any>({
        path: `/participation`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerGetAllUserParticipations
     * @request GET:/participation
     * @secure
     */
    participationControllerGetAllUserParticipations: (params: RequestParams = {}) =>
      this.request<ParticipationResponseDto[], any>({
        path: `/participation`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerRequestParticipation
     * @request POST:/participation/request
     * @secure
     */
    participationControllerRequestParticipation: (data: RequestParticipationDto, params: RequestParams = {}) =>
      this.request<ParticipationResponseDto, any>({
        path: `/participation/request`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerAcceptParticipationRequest
     * @request POST:/participation/accept
     * @secure
     */
    participationControllerAcceptParticipationRequest: (
      data: AcceptParticipationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<ParticipationResponseDto, any>({
        path: `/participation/accept`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerRejectParticipationRequest
     * @request POST:/participation/reject
     * @secure
     */
    participationControllerRejectParticipationRequest: (
      data: RejectParticipationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<ParticipationResponseDto, any>({
        path: `/participation/reject`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerCancelParticipationRequest
     * @request POST:/participation/cancel
     * @secure
     */
    participationControllerCancelParticipationRequest: (
      data: CancelParticipationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<ParticipationResponseDto, any>({
        path: `/participation/cancel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerGetEventParticipations
     * @request GET:/participation/{eventId}/participations
     * @secure
     */
    participationControllerGetEventParticipations: (eventId: string, params: RequestParams = {}) =>
      this.request<ParticipationResponseDto[], any>({
        path: `/participation/${eventId}/participations`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerGetParticipation
     * @request GET:/participation/{eventId}
     * @secure
     */
    participationControllerGetParticipation: (eventId: string, params: RequestParams = {}) =>
      this.request<ParticipationResponseDto, any>({
        path: `/participation/${eventId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Participation
     * @name ParticipationControllerGetApplePasskit
     * @request GET:/participation/apple-passkit/{token}
     */
    participationControllerGetApplePasskit: (token: string, params: RequestParams = {}) =>
      this.request<Buffer, any>({
        path: `/participation/apple-passkit/${token}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
