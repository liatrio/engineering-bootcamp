package main

import (
	"crypto/rand"
	"encoding/base32"
	"errors"
	"regexp"
	"sync"

	"github.com/gin-gonic/gin"
	devops_resource "github.com/liatrio/engineering-bootcamp/examples/ch7/devops-resources"
)

// Thread-safe stores for each data type
type EngineerStore struct {
	mu        sync.RWMutex
	engineers []*devops_resource.Engineer
}

type DevStore struct {
	mu         sync.RWMutex
	developers []*devops_resource.Dev
}

type OpsStore struct {
	mu         sync.RWMutex
	operations []*devops_resource.Ops
}

type DevOpsStore struct {
	mu                   sync.RWMutex
	developer_operations []*devops_resource.DevOps
}

// Global store instances
var engineerStore = &EngineerStore{engineers: make([]*devops_resource.Engineer, 0)}
var devStore = &DevStore{developers: make([]*devops_resource.Dev, 0)}
var opsStore = &OpsStore{operations: make([]*devops_resource.Ops, 0)}
var devOpsStore = &DevOpsStore{developer_operations: make([]*devops_resource.DevOps, 0)}

// Helper methods for testing - clear stores
func (s *EngineerStore) Clear() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.engineers = make([]*devops_resource.Engineer, 0)
}

func (s *DevStore) Clear() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.developers = make([]*devops_resource.Dev, 0)
}

func (s *OpsStore) Clear() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.operations = make([]*devops_resource.Ops, 0)
}

func (s *DevOpsStore) Clear() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.developer_operations = make([]*devops_resource.DevOps, 0)
}

// EngineerStore methods
func (s *EngineerStore) Add(engineer *devops_resource.Engineer) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.engineers = append(s.engineers, engineer)
}

func (s *EngineerStore) List() []*devops_resource.Engineer {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]*devops_resource.Engineer, len(s.engineers))
	copy(out, s.engineers)
	return out
}

func (s *EngineerStore) FindByID(id string) (*devops_resource.Engineer, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, engineer := range s.engineers {
		if engineer.Id == id {
			return engineer, true
		}
	}
	return nil, false
}

func (s *EngineerStore) FindByName(name string) (*devops_resource.Engineer, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, engineer := range s.engineers {
		if engineer.Name == name {
			return engineer, true
		}
	}
	return nil, false
}

func (s *EngineerStore) FindByEmail(email string) (*devops_resource.Engineer, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, engineer := range s.engineers {
		if engineer.Email == email {
			return engineer, true
		}
	}
	return nil, false
}

func (s *EngineerStore) DeleteByID(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.engineers {
		if s.engineers[i].Id == id {
			last := len(s.engineers) - 1
			s.engineers[i] = s.engineers[last]
			s.engineers[last] = nil // avoid retaining pointer
			s.engineers = s.engineers[:last]
			return true
		}
	}
	return false
}

// DevStore methods
func (s *DevStore) Add(dev *devops_resource.Dev) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.developers = append(s.developers, dev)
}

func (s *DevStore) List() []*devops_resource.Dev {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]*devops_resource.Dev, len(s.developers))
	copy(out, s.developers)
	return out
}

func (s *DevStore) FindByID(id string) (*devops_resource.Dev, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, dev := range s.developers {
		if dev.Id == id {
			return dev, true
		}
	}
	return nil, false
}

func (s *DevStore) FindByName(name string) (*devops_resource.Dev, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, dev := range s.developers {
		if dev.Name == name {
			return dev, true
		}
	}
	return nil, false
}

func (s *DevStore) DeleteByID(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.developers {
		if s.developers[i].Id == id {
			last := len(s.developers) - 1
			s.developers[i] = s.developers[last]
			s.developers[last] = nil // avoid retaining pointer
			s.developers = s.developers[:last]
			return true
		}
	}
	return false
}

// OpsStore methods
func (s *OpsStore) Add(ops *devops_resource.Ops) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.operations = append(s.operations, ops)
}

func (s *OpsStore) List() []*devops_resource.Ops {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]*devops_resource.Ops, len(s.operations))
	copy(out, s.operations)
	return out
}

func (s *OpsStore) FindByID(id string) (*devops_resource.Ops, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, ops := range s.operations {
		if ops.Id == id {
			return ops, true
		}
	}
	return nil, false
}

func (s *OpsStore) FindByName(name string) (*devops_resource.Ops, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, ops := range s.operations {
		if ops.Name == name {
			return ops, true
		}
	}
	return nil, false
}

func (s *OpsStore) DeleteByID(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.operations {
		if s.operations[i].Id == id {
			last := len(s.operations) - 1
			s.operations[i] = s.operations[last]
			s.operations[last] = nil // avoid retaining pointer
			s.operations = s.operations[:last]
			return true
		}
	}
	return false
}

// DevOpsStore methods
func (s *DevOpsStore) Add(devops *devops_resource.DevOps) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.developer_operations = append(s.developer_operations, devops)
}

func (s *DevOpsStore) List() []*devops_resource.DevOps {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]*devops_resource.DevOps, len(s.developer_operations))
	copy(out, s.developer_operations)
	return out
}

func (s *DevOpsStore) FindByID(id string) (*devops_resource.DevOps, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, devops := range s.developer_operations {
		if devops.Id == id {
			return devops, true
		}
	}
	return nil, false
}

func (s *DevOpsStore) DeleteByID(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.developer_operations {
		if s.developer_operations[i].Id == id {
			last := len(s.developer_operations) - 1
			s.developer_operations[i] = s.developer_operations[last]
			s.developer_operations[last] = nil // avoid retaining pointer
			s.developer_operations = s.developer_operations[:last]
			return true
		}
	}
	return false
}

// Helper method to add engineer to operation
func (s *OpsStore) AddEngineerToOp(opID string, engineer *devops_resource.Engineer) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, op := range s.operations {
		if op.Id == opID {
			op.Engineers = append(op.Engineers, engineer)
			return true
		}
	}
	return false
}

// Helper method to add engineer to dev
func (s *DevStore) AddEngineerToDev(devID string, engineer *devops_resource.Engineer) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, dev := range s.developers {
		if dev.Id == devID {
			dev.Engineers = append(dev.Engineers, engineer)
			return true
		}
	}
	return false
}

// Helper method to add dev to devops
func (s *DevOpsStore) AddDevToDevOps(devOpsID string, dev *devops_resource.Dev) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, devops := range s.developer_operations {
		if devops.Id == devOpsID {
			devops.Devs = append(devops.Devs, dev)
			return true
		}
	}
	return false
}

// Helper method to add ops to devops
func (s *DevOpsStore) AddOpsToDevOps(devOpsID string, ops *devops_resource.Ops) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, devops := range s.developer_operations {
		if devops.Id == devOpsID {
			devops.Ops = append(devops.Ops, ops)
			return true
		}
	}
	return false
}

// Helper method to remove engineer from operation
func (s *OpsStore) RemoveEngineerFromOp(opID string, engineerID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, op := range s.operations {
		if op.Id == opID {
			for i := range op.Engineers {
				if op.Engineers[i].Id == engineerID {
					last := len(op.Engineers) - 1
					op.Engineers[i] = op.Engineers[last]
					op.Engineers[last] = nil // avoid retaining pointer
					op.Engineers = op.Engineers[:last]
					return nil
				}
			}
		}
	}
	return errors.New("engineer not found in operation")
}

// Helper method to remove engineer from dev
func (s *DevStore) RemoveEngineerFromDev(devID string, engineerID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, dev := range s.developers {
		if dev.Id == devID {
			for i := range dev.Engineers {
				if dev.Engineers[i].Id == engineerID {
					last := len(dev.Engineers) - 1
					dev.Engineers[i] = dev.Engineers[last]
					dev.Engineers[last] = nil // avoid retaining pointer
					dev.Engineers = dev.Engineers[:last]
					return nil
				}
			}
		}
	}
	return errors.New("engineer not found in dev")
}

// Helper method to remove engineer from all operations and devs in devops
func (s *DevOpsStore) RemoveEngineerFromAll(engineerID string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, devops := range s.developer_operations {
		for _, op := range devops.Ops {
			for i := range op.Engineers {
				if op.Engineers[i].Id == engineerID {
					last := len(op.Engineers) - 1
					op.Engineers[i] = op.Engineers[last]
					op.Engineers[last] = nil // avoid retaining pointer
					op.Engineers = op.Engineers[:last]
					break
				}
			}
		}
		for _, dev := range devops.Devs {
			for i := range dev.Engineers {
				if dev.Engineers[i].Id == engineerID {
					last := len(dev.Engineers) - 1
					dev.Engineers[i] = dev.Engineers[last]
					dev.Engineers[last] = nil // avoid retaining pointer
					dev.Engineers = dev.Engineers[:last]
					break
				}
			}
		}
	}
}

// Helper method to remove dev from devops
func (s *DevOpsStore) RemoveDevFromDevOps(devOpsID string, devID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, devops := range s.developer_operations {
		if devops.Id == devOpsID {
			for i := range devops.Devs {
				if devops.Devs[i].Id == devID {
					last := len(devops.Devs) - 1
					devops.Devs[i] = devops.Devs[last]
					devops.Devs[last] = nil // avoid retaining pointer
					devops.Devs = devops.Devs[:last]
					return nil
				}
			}
		}
	}
	return errors.New("dev not found in devops")
}

// Helper method to remove ops from devops
func (s *DevOpsStore) RemoveOpsFromDevOps(devOpsID string, opsID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, devops := range s.developer_operations {
		if devops.Id == devOpsID {
			for i := range devops.Ops {
				if devops.Ops[i].Id == opsID {
					last := len(devops.Ops) - 1
					devops.Ops[i] = devops.Ops[last]
					devops.Ops[last] = nil // avoid retaining pointer
					devops.Ops = devops.Ops[:last]
					return nil
				}
			}
		}
	}
	return errors.New("ops not found in devops")
}

func verifyEmail(email string) bool {
	result, _ := regexp.MatchString("^[\\w._%+\\-\\/\\]+@[\\w.\\-]+\\.[a-z]{2,4}$", email)
	return result
}

func getRandId(length int) string {
	randomBytes := make([]byte, 32)
	_, err := rand.Read(randomBytes)
	if err != nil {
		panic(err)
	}
	return base32.StdEncoding.EncodeToString(randomBytes)[:length]
}

func main() {
	router := gin.Default()

	//GET routes
	router.GET("/engineers", getEngineer)
	router.GET("/engineers/id/:id", getSpecificEngineerById)
	router.GET("/engineers/name/:name", getSpecificEngineerByName)
	router.GET("/engineers/email/:email", getSpecificEngineerByEmail)
	router.GET("/dev", getDev)
	router.GET("/dev/id/:id", getSpecificDevById)
	router.GET("/dev/name/:name", getSpecificDevByName)
	router.GET("/op", getOp)
	router.GET("/op/id/:id", getSpecificOpsById)
	router.GET("/op/name/:name", getSpecificOpsByName)
	router.GET("/devops", getDevOps)
	router.GET("/devops/:id", getSpecificDevOpsById)

	//POST routes
	router.POST("/engineers", postEngineer)
	router.POST("/dev", postDev)
	router.POST("/op", postOp)
	router.POST("/devops", postDevOps)
	router.POST("/dev/:id", postDevEngineer)
	router.POST("/op/:id", postOpEngineer)
	router.POST("/devops/dev/:id", postDevOpsDev)
	router.POST("/devops/op/:id", postDevOpsOp)

	//PUT routes
	router.PUT("/engineers/:id", putEngineer)
	router.PUT("/dev/:id", putDev)
	router.PUT("/op/:id", putOp)
	router.PUT("/devops/:id", putDevOps)

	//DELETE routes
	router.DELETE("/engineers/:id", deleteRequestEngineer)
	router.DELETE("/dev/:id", deleteRequestDev)
	router.DELETE("/op/:id", deleteRequestOp)
	router.DELETE("/devops/:id", deleteRequestDevOps)

	//runs server
	router.Run(":8080")
}
