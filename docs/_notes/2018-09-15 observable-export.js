// URL: https://beta.observablehq.com/d/ea960630ac62eca6
// Title: CSV to JSON by column
// Author: Mac Cowell (@100ideas)
// Version: 280
// Runtime version: 1

const m0 = {
  id: "ea960630ac62eca6@280",
  variables: [
    {
      inputs: ["md"],
      value: function(md) {
        return md`
# CSV to JSON by column

Turn CSV data into JSON format, sorted by duplicate entries of a column.

1.  Paste CSV data
2.  Choose column
3.  Choose pretty or minified output
        `;
      }
    },
    {
      name: "viewof input",
      inputs: ["html"],
      value: function(html) {
        return html`<textarea style="width: 500px; height: 200px; resize: none;" class="input" value="" placeholder="CSV data here"></textarea>`;
      }
    },
    {
      name: "input",
      inputs: ["Generators", "viewof input"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
### Select column to sort by
        `;
      }
    },
    {
      name: "viewof keySelect",
      inputs: ["html", "input", "CSVToArray"],
      value: function(html, input, CSVToArray) {
        let wrapper = html`<ul></ul>`;
        wrapper.value = "";
        let oldItem;

        const colors = {
          inactive: "#9c9c9c",
          active: "#FD5E44",
          hover: "#6e6e6e"
        };
        const liStyle = `
    padding: 1px 7px;
    background: ${colors.inactive};
    margin: 2px;
    cursor: pointer;
    font-family: Roboto, sans-serif;
    font-size: 16px;
    color: white;
    border-radius: 3px;
  `;

        if (input.length > 0) {
          const data = CSVToArray(input);
          const cols = data[0];

          const items = cols.map(col => {
            const item = html`<li style="${liStyle}">${col}</li>`;
            item.addEventListener("mouseover", ele => {
              ele.target.style.backgroundColor = colors.hover;
            });
            item.addEventListener("mouseout", ele => {
              if (ele.target === oldItem) {
                ele.target.style.backgroundColor = colors.active;
              } else {
                ele.target.style.backgroundColor = colors.inactive;
              }
            });
            item.addEventListener("click", ele => {
              wrapper.value = col;
              wrapper.dispatchEvent(new CustomEvent("input"));

              ele.target.style.backgroundColor = colors.active;
              ele.target.style.fontWeight = 700;

              if (oldItem) {
                oldItem.style.backgroundColor = colors.inactive;
                oldItem.style.fontWeight = 400;
              }
              oldItem = ele.target;
            });
            return item;
          });
          wrapper = html`<ul style="list-style: none; padding: 0; display: flex; flex-direction: row;">${items}</ul>`;
        }

        return wrapper;
      }
    },
    {
      name: "keySelect",
      inputs: ["Generators", "viewof keySelect"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof pretty",
      inputs: ["html"],
      value: function(html) {
        return html`<input type="checkbox" checked></input>`;
      }
    },
    {
      name: "pretty",
      inputs: ["Generators", "viewof pretty"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["html", "pretty", "output"],
      value: function(html, pretty, output) {
        return html`<textarea style="width: 500px; height: 200px; resize: none;" class="input">${
          pretty ? JSON.stringify(output, null, 2) : JSON.stringify(output)
        }</textarea>`;
      }
    },
    {
      name: "output",
      inputs: ["input", "keySelect", "CSVToArray", "_"],
      value: function(input, keySelect, CSVToArray, _) {
        let data = null;

        if (input.length > 0 && keySelect.length > 0) {
          data = CSVToArray(input);
          const cols = data[0];
          const values = _.drop(data);
          const result = {};

          // get selection index
          const selectedIndex = cols.indexOf(keySelect);

          for (let i = 0; i < values.length; i += 1) {
            const row = values[i];
            const key = cols[selectedIndex];
            const rowObject = {};

            for (let ri = 0; ri < row.length; ri += 1) {
              if (ri !== selectedIndex) {
                rowObject[cols[ri]] = row[ri];
              }
            }

            if (!result[row[selectedIndex]]) result[row[selectedIndex]] = [];
            result[row[selectedIndex]].push(rowObject);
          }

          return result;
        } else {
          return "";
        }
      }
    },
    {
      name: "_",
      inputs: ["require"],
      value: function(require) {
        return require("lodash");
      }
    },
    {
      name: "CSVToArray",
      value: function() {
        return function CSVToArray(strData, strDelimiter) {
          // Check to see if the delimiter is defined. If not,
          // then default to comma.
          strDelimiter = strDelimiter || ",";

          // Create a regular expression to parse the CSV values.
          var objPattern = new RegExp(
            // Delimiters.
            "(\\" +
              strDelimiter +
              "|\\r?\\n|\\r|^)" +
              // Quoted fields.
              '(?:"([^"]*(?:""[^"]*)*)"|' +
              // Standard fields.
              '([^"\\' +
              strDelimiter +
              "\\r\\n]*))",
            "gi"
          );

          // Create an array to hold our data. Give the array
          // a default empty first row.
          var arrData = [[]];

          // Create an array to hold our individual pattern
          // matching groups.
          var arrMatches = null;

          // Keep looping over the regular expression matches
          // until we can no longer find a match.
          while ((arrMatches = objPattern.exec(strData))) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
              strMatchedDelimiter.length &&
              strMatchedDelimiter != strDelimiter
            ) {
              // Since we have reached a new row of data,
              // add an empty row to our data array.
              arrData.push([]);
            }

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
              // We found a quoted value. When we capture
              // this value, unescape any double quotes.
              var strMatchedValue = arrMatches[2].replace(
                new RegExp('""', "g"),
                '"'
              );
            } else {
              // We found a non-quoted value.
              var strMatchedValue = arrMatches[3];
            }

            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
          }

          // Return the parsed data.
          return arrData;
        };
      }
    },
    {
      inputs: ["html"],
      value: function(html) {
        return html`
<style>
	@import url('https://fonts.googleapis.com/css?family=Roboto:400,700');


</style>
`;
      }
    }
  ]
};

const notebook = {
  id: "ea960630ac62eca6@280",
  modules: [m0]
};

export default notebook;
