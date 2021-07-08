﻿// -----------------------------------------------------------------------
// <copyright file="IMessage.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------

namespace EmailAWS
{
    public interface IMessage
    {
        public string From { get; set; }

        public string To { get; set; }

        public string Subject { get; set; }

        public string PlainText { get; set; }

        public string Html { get; set; }
    }
}
