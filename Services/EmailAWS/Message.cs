// -----------------------------------------------------------------------
// <copyright file="Message.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------

namespace EmailAWS
{
    public class Message : IMessage
    {
        public Message()
        {
        }

        public Message(IMessage msg)
        {
            this.From = msg.From;
            this.To = msg.To;
            this.PlainText = msg.PlainText;
            this.Html = msg.Html;
        }

        public string From { get; set; }

        public string To { get; set; }

        public string Subject { get; set; }

        public string PlainText { get; set; }

        public string Html { get; set; }
    }
}
