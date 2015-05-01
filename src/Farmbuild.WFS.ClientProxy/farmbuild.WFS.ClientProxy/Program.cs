/*
 The MIT License (MIT) 
 
 
 Copyright (c) 2015 FarmBuild 
 
 
 Permission is hereby granted, free of charge, to any person obtaining a copy 
 of this software and associated documentation files (the "Software"), to deal 
 in the Software without restriction, including without limitation the rights 
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 copies of the Software, and to permit persons to whom the Software is 
 furnished to do so, subject to the following conditions: 
 
 
 The above copyright notice and this permission notice shall be included in all 
 copies or substantial portions of the Software. 
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 SOFTWARE. 

 */


using Microsoft.Owin.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Owin;
using Thinktecture.IdentityModel.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Configuration;
using System.IO;
using System.Web.Http.Controllers;
using System.Threading;

namespace FarmBuild.WFS.ClientProxy
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                if (args.Length == 0)
                {
                    Console.WriteLine("The self hosting requires Client Id and Client Secert to start.");
                }
                else
                {
                    var clientId = args[0];
                    var clientSecert = args[1];
                    var scope = "WFS_SERVICES SOIL_AREA_SERVICES CLIMATE_DATA_SERVICES";
                    ClientInformation.SetClientInformation(clientId, clientSecert, scope);
                    string baseAddress = "http://localhost:9000/";

                    // Start OWIN host 
                    WebApp.Start<Startup>(url: baseAddress);

                    Console.WriteLine("This is a self hosting as a Client Proxy for All soils has started.");
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            Console.ReadLine();

        }


    }
    /// <summary>
    /// This is a start up of the Web Api configuration
    /// </summary>
    public class Startup
    {
        // This code configures Web API. The Startup class is specified as a type
        // parameter in the WebApp.Start method.
        public void Configuration(IAppBuilder appBuilder)
        {
            // Configure Web API for self-host. 
            HttpConfiguration config = new HttpConfiguration();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            appBuilder.UseWebApi(config);
        }

    }

    /// <summary>
    /// Soils controller to return WFS soils
    /// </summary>
    [Route("soils")]
    public class SoilsController : ApiController
    {
        public dynamic Get()
        {
            var response = WebApi.GetToken();
            var token = JsonConvert.DeserializeObject<Token>(response.Json.ToString());
            var allSoilsUri = ConfigurationManager.AppSettings["WfsUri"];
            var request = allSoilsUri + "/soils";

            var responseApi =  WebApi.GetApi(token, request);
            return responseApi.Result;
        }

    }
    /// <summary>
    /// Parcels controller to return WFS parcels
    /// </summary>
    [Route("parcels")]
    public class ParcelsController : ApiController
    {
        [HttpGet]
        public dynamic Get()
        {
            var response = WebApi.GetToken();
            var token = JsonConvert.DeserializeObject<Token>(response.Json.ToString());
            var allSoilsUri = ConfigurationManager.AppSettings["WfsUri"];
            var request = allSoilsUri + "/parcels";
            var responseApi = WebApi.GetApi(token, request);
            return responseApi.Result;

        }

    }
    /// <summary>
    /// Areas controller to return soil areas with input of Farm data
    /// </summary>
    [Route("areas")]
    public class AreasController : ApiController
    {
        [HttpPost]
        public dynamic Post([NakedBody] string input)
        {
            var response = WebApi.GetToken();
            var token = JsonConvert.DeserializeObject<Token>(response.Json.ToString());
            var areaUri = ConfigurationManager.AppSettings["AreaUri"];
            var request = areaUri + "/areas";
            var responseApi = WebApi.PostApi(token, request, input);
            return JObject.Parse(responseApi.Result);

        }

    }

    /// <summary>
    /// Web Api is a common object to be used the diffect controller
    /// </summary>
    static class WebApi
    {
        /// <summary>
        /// Getting the OAuth2 token for the web services
        /// </summary>
        /// <returns></returns>
        public static TokenResponse GetToken()
        {
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            var tokenEndPoint = ConfigurationManager.AppSettings["TokenUri"];
            var client = new OAuth2Client(new Uri(tokenEndPoint), ClientInformation.ClientId, ClientInformation.ClientSecert);
            return client.RequestClientCredentialsAsync(ClientInformation.Scope).Result;

        }
        /// <summary>
        /// Get api is passing the token and request to retun the response
        /// </summary>
        /// <param name="token">OAuth2 token the from the Identity services</param>
        /// <param name="requestUrl">Request url to obtain response</param>
        /// <returns>Task with results</returns>
        public static async Task<dynamic> GetApi(Token token, string requestUrl)
        {
            try
            {
                var request = (HttpWebRequest)WebRequest.Create(requestUrl);
                request.ContentType = "text/json";
                request.Method = "GET";
                WebHeaderCollection webHeaderCollection = request.Headers;
                webHeaderCollection.Add("Authorization", token.Token_Type + " " + token.Access_Token);

                var response = (HttpWebResponse)await Task.Factory
                    .FromAsync<WebResponse>(request.BeginGetResponse,
                                            request.EndGetResponse,
                                            null);

                Console.WriteLine(response.StatusCode);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    using (var streamReader = new StreamReader(response.GetResponseStream()))
                    {
                        var result = streamReader.ReadToEnd();
                        return result;
                    }
                }
                else
                {
                    return response.StatusDescription;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        /// <summary>
        /// Post api is passing the token and request to retun the response
        /// with an input
        /// </summary>
        /// <param name="token">OAuth2 token the from the Identity services</param>
        /// <param name="requestUrl">Request url to obtain response</param>
        /// <param name="input">Input as a payload</param>
        /// <returns>Task with results</returns>
        public static async Task<dynamic> PostApi(Token token, string requestUrl, string input)
        {
            try
            {
                byte[] data = new ASCIIEncoding().GetBytes(input);
                var request = (HttpWebRequest)WebRequest.Create(requestUrl);
                request.ContentType = "text/json";
                request.Method = "POST";
                WebHeaderCollection webHeaderCollection = request.Headers;
                webHeaderCollection.Add("Authorization", token.Token_Type + " " + token.Access_Token);
                request.ContentLength = data.Length;
                Stream currentStream = request.GetRequestStream();
                currentStream.Write(data, 0, data.Length);
                currentStream.Close();

                var response = (HttpWebResponse)await Task.Factory
                    .FromAsync<WebResponse>(request.BeginGetResponse,
                            request.EndGetResponse,
                            null);

                Console.WriteLine(response.StatusCode);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    using (var streamReader = new StreamReader(response.GetResponseStream()))
                    {
                        var result = streamReader.ReadToEnd();
                        return result;
                    }
                }
                else
                {
                    return response.StatusDescription;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }

    /// <summary>
    /// Enable constants when the project starts to be used and get the token.
    /// </summary>
    static class ClientInformation
    {
        public static void SetClientInformation(string clientId, string clientSecert, string scope)
        {
            ClientId = clientId;
            ClientSecert = clientSecert;
            Scope = scope;
        }

        public static string ClientId { get; private set; }
        public static string ClientSecert { get; private set; }
        public static string Scope { get; private set; }

    }

    /// <summary>
    /// Token object 
    /// </summary>
    internal class Token
    {
        public string Access_Token { get; set; }
        public string Token_Type { get; set; }
        public string Expires_In { get; set; }
    }


    /// <summary>
    /// An attribute that captures the entire content body and stores it
    /// into the parameter of type string or byte[].
    /// </summary>
    /// <remarks>
    /// The parameter marked up with this attribute should be the only parameter as it reads the
    /// entire request body and assigns it to that parameter.    
    /// </remarks>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Parameter, AllowMultiple = false, Inherited = true)]
    public sealed class NakedBodyAttribute : ParameterBindingAttribute
    {
        public override HttpParameterBinding GetBinding(HttpParameterDescriptor parameter)
        {
            if (parameter == null)
                throw new ArgumentException("Invalid parameter");

            return new NakedBodyParameterBinding(parameter);
        }
    }
    /// <summary>
    /// Reads the Request body into a string/byte[] and
    /// assigns it to the parameter bound.
    /// 
    /// Should only be used with a single parameter on
    /// a Web API method using the [NakedBody] attribute
    /// </summary>
    public class NakedBodyParameterBinding : HttpParameterBinding
    {
        public NakedBodyParameterBinding(HttpParameterDescriptor descriptor)
            : base(descriptor)
        {

        }

        public override bool WillReadBody
        {
            get
            {
                return true;
            }
        }

        public override Task ExecuteBindingAsync(System.Web.Http.Metadata.ModelMetadataProvider metadataProvider, 
            HttpActionContext actionContext,
            CancellationToken cancellationToken)
        {
            var binding = actionContext
                .ActionDescriptor
                .ActionBinding;

            if (binding.ParameterBindings.Length > 1 ||
                actionContext.Request.Method == HttpMethod.Get)
                return EmptyTask.Start();

            var type = binding
                        .ParameterBindings[0]
                        .Descriptor.ParameterType;

            if (type == typeof(string))
            {
                return actionContext.Request.Content
                        .ReadAsStringAsync()
                        .ContinueWith((task) =>
                        {
                            var stringResult = task.Result;
                            SetValue(actionContext, stringResult);
                        });
            }
            else if (type == typeof(byte[]))
            {
                return actionContext.Request.Content
                    .ReadAsByteArrayAsync()
                    .ContinueWith((task) =>
                    {
                        byte[] result = task.Result;
                        SetValue(actionContext, result);
                    });
            }
            

            throw new InvalidOperationException("Only string and byte[] are supported for [NakedBody] parameters");
        }
    }

     /// <summary>
    /// A do nothing task that can be returned
    /// from functions that require task results
    /// when there's nothing to do.
    /// 
    /// This essentially returns a completed task
    /// with an empty value structure result.
    /// </summary>
    public class EmptyTask
    {
        public static Task Start()
        {
            var taskSource = new TaskCompletionSource<AsyncVoid>();
            taskSource.SetResult(default(AsyncVoid));
            return taskSource.Task as Task;
        }

        private struct AsyncVoid
        {
        }
    }
}
