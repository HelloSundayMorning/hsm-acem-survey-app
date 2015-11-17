package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	gobrake "gopkg.in/airbrake/gobrake.v1"
)

// Recover returns Gin middleware that reports all `panic`s to Airbrake
func Recover(airbrake *gobrake.Notifier) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		defer func() {
			r := recover()
			if r == nil {
				return
			}

			var err error
			if e, ok := r.(error); !ok {
				err = fmt.Errorf("%v", r)
			} else {
				err = e
			}

			// not using goroutine here in order to keep the whole backtrace in
			// airbrake report
			airbrake.Notify(err, ctx.Request)
			panic(r)
		}()

		ctx.Next()
	}
}
