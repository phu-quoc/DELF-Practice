const mongoose = require('mongoose');
const slugify = require('slugify');

const grammarSchema = new mongoose.Schema(
  {
    grammar: {
      type: String,
      required: [true, 'A grammar must have a valid name'],
      unique: true,
    },
    slug: String,
    content: {
      type: String,
      required: [true, 'A grammar must have a valid content'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

grammarSchema.virtual('grammarLength').get(function () {
  return this.grammar.length;
});

//DOCUMENT MIDDLEWARE
grammarSchema.pre('save', function (next) {
  console.log(this);
  this.slug = slugify(this.grammar, {
    lower: true,
  });
  next();
});

//QUERY MIDDLEWARE
// grammarSchema.pre(/^find/, function (next) {
//   this.find({
//     grammar: {
//       $ne: 'Past simple tense',
//     },
//   });
//   next();
// });

//AGGREGATION MIDDLEWARE
// grammarSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: {
//       grammar: {
//         $ne: 'Present continuous tense',
//       },
//     },
//   });
//   next();
// });
const Grammar = mongoose.model('Grammar', grammarSchema);

module.exports = Grammar;
