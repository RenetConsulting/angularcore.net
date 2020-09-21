// <copyright file="DataExpression.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Reflection;
    using Application.DataAccess.Entities;

    public class DataExpression
    {
        public static List<Expression> WhereExpressionsByObject<TEntity, TObject>(TObject theObject, ParameterExpression parameter)
            where TEntity : ApplicationEntity
        {
            // list of expressions
            List<Expression> whereExpressions = new List<Expression>();

            if (theObject == null)
            {
                return whereExpressions;
            }

            // contains array of public properties of the object
            PropertyInfo[] objectProperties = typeof(TObject).GetProperties(BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            // used to create LIKE operation
            MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });

            // loop through the object properties to find match
            foreach (var property in objectProperties)
            {
                // the property value
                var value = property.GetValue(theObject, null);

                // property of the entity object that is match the object property
                var entityProperty = typeof(TEntity).GetProperty(property.Name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

                if (value != null && entityProperty != null)
                {
                    var column = Expression.Property(parameter, property.Name);

                    // based on the type of the property object, create an expression
                    switch (Type.GetTypeCode(value.GetType()))
                    {
                        // for string - use the "contains"
                        case TypeCode.String:
                            whereExpressions.Add(Expression.Call(
                                column,
                                method,
                                Expression.Constant(value)));
                            break;
                        case TypeCode.SByte:
                        case TypeCode.Byte:
                            break;
                        case TypeCode.Char:
                            break;
                        case TypeCode.DateTime:
                            break;
                        case TypeCode.Empty:
                            break;

                        // for numeric or boolean - use equal
                        case TypeCode.Decimal:
                        case TypeCode.Single:
                        case TypeCode.Double:
                        case TypeCode.Int16:
                        case TypeCode.Int32:
                        case TypeCode.Int64:
                        case TypeCode.UInt16:
                        case TypeCode.UInt32:
                        case TypeCode.UInt64:
                        case TypeCode.Boolean:
                            whereExpressions.Add(Expression.Equal(
                                    column,
                                    Expression.Convert(Expression.Constant(value), column.Type)));
                            break;
                        case TypeCode.Object:
                            break;
                    }
                }
            }

            return whereExpressions;
        }

        public static Expression BuildOrExpression(List<Expression> whereOrExpressions)
        {
            Expression weOr = null;

            if (whereOrExpressions.Count > 0)
            {
                int i = 0;
                weOr = whereOrExpressions[i];

                while (++i < whereOrExpressions.Count)
                {
                    weOr = Expression.MakeBinary(ExpressionType.OrElse, weOr, whereOrExpressions[i]);
                }
            }

            return weOr;
        }

        public static Expression BuildAndExpression(List<Expression> whereAndExpressions)
        {
            Expression weAnd = null;
            if (whereAndExpressions.Count > 0)
            {
                int i = 0;
                weAnd = whereAndExpressions[i];
                while (++i < whereAndExpressions.Count)
                {
                    weAnd = Expression.MakeBinary(ExpressionType.AndAlso, weAnd, whereAndExpressions[i]);
                }
            }

            return weAnd;
        }

        public static Expression CombineAndExpression(Expression weOr, Expression weAnd)
        {
            Expression weCombined = null;

            if (weAnd != null && weOr != null)
            {
                weCombined = Expression.MakeBinary(ExpressionType.AndAlso, weAnd, weOr);
            }
            else
            {
                if (weAnd != null)
                {
                    weCombined = weAnd;
                }

                if (weOr != null)
                {
                    weCombined = weOr;
                }
            }

            return weCombined;
        }

        public static IQueryable<TEntity> BuildWhereSelector<TEntity, TAndObject, TOrObject>(IQueryable<TEntity> selector, TAndObject whereAnd, TOrObject whereOr)
            where TEntity : ApplicationEntity
        {
            var parameter = Expression.Parameter(typeof(TEntity), "x");

            List<Expression> whereAndExpressions = DataExpression.WhereExpressionsByObject<TEntity, TAndObject>(whereAnd, parameter);

            List<Expression> whereOrExpressions = DataExpression.WhereExpressionsByObject<TEntity, TOrObject>(whereOr, parameter);
            Expression weOr = DataExpression.BuildOrExpression(whereOrExpressions);
            Expression weAnd = DataExpression.BuildAndExpression(whereAndExpressions);
            Expression weCombined = DataExpression.CombineAndExpression(weOr, weAnd);

            if (weCombined != null)
            {
                selector = selector.Where((Expression<Func<TEntity, bool>>)Expression.Lambda(weCombined, parameter));
            }

            return selector;
        }
    }
}
