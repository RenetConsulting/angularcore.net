// <copyright file="CaptchaModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace CoreCaptcha
{
    using System.Web.Script.Serialization;

    public class CaptchaModel
    {
        public string Image { get; set; }
        public string Sound { get; set; }
        public string Hash { get; set; }

        public string ToJson()
        {
            return new JavaScriptSerializer().Serialize(this);
        }
    }
}
