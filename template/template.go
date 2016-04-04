// Package template implements a simple layout system on top of
// package html/template.
//
// template loads template files from app/views folder. And loads and
// parses the templates. All template files must has extension `.tmpl`.
//
// The default layout is "layouts/application".
//
// Render a partial in a template:
// 	{{render "users/partial" data}}
//
// Use a new layout:
// 	Layout("layouts/my-layout").Execute(...)
//
// Add a new func:
// 	FuncMap["your-func"] = func() string {...}
package template

import (
	"bytes"
	"html/template"
	"io"
	"log"
	"os"
	"path/filepath"
	"sync"
)

var (
	// FuncMap contains default template methods made available to
	// templates:
	// - render: render a separate template in-place.
	// - content: used in layout templates to render result of content template.
	FuncMap template.FuncMap

	// ViewPath is path of view templates relative to WEB_ROOT (or
	// used directly if WEB_ROOT is undefined.
	ViewPath      = "app/views"
	templates     = map[string]*template.Template{}
	defaultLayout = Layout("layouts/application")

	// ConstantReload controls whether the templates are loaded from
	// disk and parsed *once* at first use (when false), or every time
	// the template is rendered (when true).
	ConstantReload bool
)

func init() {
	FuncMap = template.FuncMap{"render": Render, "content": func() template.HTML { return "" }}
	if root := os.Getenv("WEB_ROOT"); root != "" {
		ViewPath = filepath.Join(root, ViewPath)
	}
}

// Layout is a wrapper to allow below methods to be associated with
// template names.
type Layout string

// Execute loads and parses template `name` and write the result to w.
func (t Layout) Execute(w io.Writer, name string, data interface{}, funcMaps ...template.FuncMap) (err error) {
	funcMaps = append(funcMaps, template.FuncMap{
		"content": func() (template.HTML, error) { return Render(name, data, funcMaps...) },
	})

	tmpl, err := find(string(t), funcMaps...)
	if err != nil {
		return
	}

	var buf bytes.Buffer
	err = tmpl.Execute(&buf, data)
	if err == nil {
		_, err = io.Copy(w, &buf)
	}

	return
}

// Execute runs default template's Execute.
func Execute(w io.Writer, name string, data interface{}, funcMaps ...template.FuncMap) (err error) {
	return defaultLayout.Execute(w, name, data, funcMaps...)
}

// Render loads and parses a template, at last returns the result.
func Render(name string, data interface{}, funcMaps ...template.FuncMap) (text template.HTML, err error) {
	tmpl, err := find(name, funcMaps...)
	if err != nil {
		return
	}

	var buf bytes.Buffer
	err = tmpl.Execute(&buf, data)
	text = template.HTML(buf.String())
	return
}

var mutex sync.Mutex

func find(name string, funcMaps ...template.FuncMap) (tmpl *template.Template, err error) {
	var ok bool
	name = filepath.Join(ViewPath, name) + ".tmpl"
	if tmpl, ok = templates[name]; !ok || ConstantReload {
		if tmpl, err = new(funcMaps...).ParseFiles(name); err != nil {
			log.Println("ParseFiles:", err)
			return
		}
		tmpl = tmpl.Lookup(filepath.Base(name))
		mutex.Lock()
		templates[name], err = tmpl.Clone()
		mutex.Unlock()
	} else {
		// IMPORTANT: always override old funcmaps, because they might be context-relevant
		tmpl, err = tmpl.Clone()
		if err != nil {
			return
		}
		overrideFuncmaps(tmpl, funcMaps)
	}

	return
}

func overrideFuncmaps(tmpl *template.Template, funcMaps []template.FuncMap) {
	funcMaps = append(funcMaps, template.FuncMap{
		"render": func(n string, d interface{}) (template.HTML, error) { return Render(n, d, funcMaps...) },
	})
	for _, funcMap := range funcMaps {
		tmpl = tmpl.Funcs(funcMap)
	}
}

func new(funcMaps ...template.FuncMap) *template.Template {
	tmpl := template.New("").Funcs(FuncMap)

	// IMPORTANT: need to initialize funcmaps here to avoid template parse errors
	overrideFuncmaps(tmpl, funcMaps)

	return tmpl
}
