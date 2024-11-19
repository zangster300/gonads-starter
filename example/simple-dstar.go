// package simple_dstar

// import (
// 	"fmt"
// 	"net/http"

// 	"github.com/delaneyj/datastar"
// 	"github.com/go-chi/chi/v5"
// 	"github.com/goccy/go-json"
// )

// func main() {
//     router := chi.NewRouter()

//     type TestStore struct {
//         AcceptRules bool `json:"acceptRules"`
//     }

//     tmpl := []byte(fmt.Sprintf(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <title>Test</title>
//             <script defer type="module" src="https://cdn.jsdelivr.net/npm/@sudodevnull/datastar@0.19.6/+esm"></script>
//         </head>
//         <body>
//             <div data-store='%s'>
//                 <input type="checkbox" data-model="acceptRules"/>
//                 <label for="accept-rules2">Acepto doble binding con model</label>
//             </div>
//             <div id="errors"></div>
//             <p data-text="$acceptRules"></p>
//             <button data-on-click="$$post('/dealWithIt')">Deal with it</button>
//         </body>
//         </html>
//     `, mustJSON(TestStore{})))

//     router.Get("/", func(w http.ResponseWriter, r *http.Request) {
//         w.Write(tmpl)
//     })

//     router.Post("/dealWithIt", func(w http.ResponseWriter, r *http.Request) {
//         store := &TestStore{}
//         if err := datastar.BodyUnmarshal(r, store); err != nil {
//             http.Error(w, "failed to unmarshal body", http.StatusInternalServerError)
//             return
//         }

//         sse := datastar.NewSSE(w, r)
//         if store.AcceptRules {
//             datastar.Redirect(sse, "https://www.youtube.com/watch?v=ZXsQAXx_ao0")
//         } else {
//             datastar.RenderFragmentString(sse, `<div id="errors">you must accept the rules</div>`)
//         }

//     })

//     http.ListenAndServe(":8888", router)
// }

// func mustJSON(x any) string {
//     b, err := json.Marshal(x)
//     if err != nil {
//         panic(err)
//     }
//     return string(b)
// }

package simple_dstar