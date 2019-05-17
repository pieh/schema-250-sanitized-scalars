exports.sourceNodes = ({ actions, schema }) => {
  actions.createNode({
    id: "foo",
    "field_that_needs_to_be_sanitized?": "foo",
    "(another)_field_that_needs_to_be_sanitized": "bar",
    "!third_field_that_needs_to_be_sanitized": "baz",
    internal: {
      type: "Repro",
      contentDigest: "foo",
    },
  })

  actions.createTypes(
    schema.buildObjectType({
      name: "Repro",
      interfaces: ["Node"],
      extensions: {
        infer: true,
      },
      fields: {
        // this will return null
        field_that_needs_to_be_sanitized_: "String",
        // this will work
        _another__field_that_needs_to_be_sanitized: {
          type: "String",
          resolve: source =>
            source["(another)_field_that_needs_to_be_sanitized"],
        },
        // third field will be inferred and also will work
      },
    })
  )
}

exports.createPages = async ({ graphql }) => {
  const { data } = await graphql(`
    {
      repro {
        field_that_needs_to_be_sanitized_
        _another__field_that_needs_to_be_sanitized
        _third_field_that_needs_to_be_sanitized
      }
    }
  `)

  console.log(data.repro)
  process.exit()
}
