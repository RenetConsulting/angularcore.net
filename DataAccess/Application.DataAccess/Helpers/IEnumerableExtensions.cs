namespace Application.DataAccess.Helpers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Reflection;
    using Application.DataAccess.Enums;

    public static class IEnumerableExtensions
    {
        public static IEnumerable<T> Skip<T>(this IEnumerable<T> selector, int? skip)
        {
            if (skip.HasValue)
            {
                selector = Enumerable.Skip(selector, skip.Value);
            }

            return selector;
        }

        public static IEnumerable<T> Take<T>(this IEnumerable<T> selector, int? take)
        {
            if (take.HasValue)
            {
                selector = Enumerable.Take(selector, take.Value);
            }

            return selector;
        }

        public static IEnumerable<T> SortBy<T>(this IEnumerable<T> selector, string sortFieldName, SortOrder? sortOrder)
        {
            if (!Equals(sortFieldName, null))
            {
                SortOrder order = sortOrder ?? SortOrder.Ascending;
                selector = order == SortOrder.Descending ? IEnumerableExtensions.OrderByDescending(selector, sortFieldName) : IEnumerableExtensions.OrderBy(selector, sortFieldName);
            }

            return selector;
        }

        public static IOrderedEnumerable<T> OrderBy<T>(this IEnumerable<T> query, string propertyName)
        {
            return OrderByString(query, "OrderBy", propertyName);
        }

        public static IOrderedEnumerable<T> OrderByDescending<T>(this IEnumerable<T> query, string propertyName)
        {
            return OrderByString(query, "OrderByDescending", propertyName);
        }

        private static IOrderedEnumerable<T> OrderByString<T>(IEnumerable<T> query, string methodName, string propertyName)
        {
            var entityType = typeof(T);

            // Create x=>x.PropName
            var propertyInfo = entityType.GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            ParameterExpression arg = Expression.Parameter(entityType, "x");
            MemberExpression property = Expression.Property(arg, propertyName);
            var selector = Expression.Lambda(property, new ParameterExpression[] { arg });

            // Get System.Linq.Queryable.OrderBy() method.
            var enumarableType = typeof(Enumerable);
            var method = enumarableType.GetMethods()
                 .Where(m => m.Name == methodName && m.IsGenericMethodDefinition)
                 .Where(m =>
                 {
                     var parameters = m.GetParameters().ToList();

                     // Put more restriction here to ensure selecting the right overload
                     return parameters.Count == 2; // overload that has 2 parameters
                 }).Single();

            // The linq's OrderBy<TSource, TKey> has two generic types, which provided here
            MethodInfo genericMethod = method
                 .MakeGenericMethod(entityType, propertyInfo.PropertyType);

            /*Call query.OrderBy(selector), with query and selector: x=> x.PropName
              Note that we pass the selector as Expression to the method and we don't compile it.
              By doing so EF can extract "order by" columns and generate SQL for it.*/
            var newQuery = (IOrderedEnumerable<T>)genericMethod
                 .Invoke(genericMethod, new object[] { query, selector.Compile() });
            return newQuery;
        }
    }
}
