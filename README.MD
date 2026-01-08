# Many to many item selector for the new CMS

Consider you have created content structures and you want to
manage many-to-many relationships between them.

For example, you manage a movie database and you have a many-to-many
relationship between **Movies** and **Actors**.

![Image Binding contents with a many to many relationship](https://github.com/fabian-bouche-liferay/many-to-many-cx/edit/master/manytomany.gif)

## Settings things up

In 2025.Q4, you cannot create the many-to-many relationship from
within the new CMS.

You have to leave the CMS and go to Objects administration where
you can add the relationship.

This repo contains a custom fragment which relies on a custom
`jsImportMapsEntry` client extension you have to deploy.

Then, create in the global site the `related-m2m-item-selector`
fragment as found in the fragments folder of this repo.

When customizing the content structure experience, you
can drop this custom fragment and configure it (providing
the name of the object relationship in the configuration
as well as the context path of the API of the two object
definitions involved).

## Limitations

Unlike Object Entries, there is nothing like a draft status
for an Object Relationship.

It means that as soon as you add a many to many relationship
between two object entries, that relationship exists,
even before you hit the publish button.
