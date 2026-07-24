package main

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/liatrio/engineering-bootcamp/examples/ch7/devops-resources"
)

func removeEngineerElement(engineers []*devops_resource.Engineer, engineer_id string) ([]*devops_resource.Engineer, error) {
	for i := range engineers {
		if engineers[i].Id == engineer_id {
			if len(engineers) == 1 {
				var empty []*devops_resource.Engineer
				return empty, nil
			}
			engineers[i] = engineers[len(engineers)-1]
			return engineers[:len(engineers)-1], nil
		}
	}
	return nil, errors.New("engineer not found and not deleted")
}

func removeDevElement(devs []*devops_resource.Dev, dev_id string) ([]*devops_resource.Dev, error) {
	for i := range devs {
		if devs[i].Id == dev_id {
			devs[i] = devs[len(devs)-1]
			return devs[:len(devs)-1], nil
		}
	}
	return nil, errors.New("developer not found and not deleted")
}

func removeOpElement(ops []*devops_resource.Ops, op_id string) ([]*devops_resource.Ops, error) {
	for i := range ops {
		if ops[i].Id == op_id {
			ops[i] = ops[len(ops)-1]
			return ops[:len(ops)-1], nil
		}
	}
	return nil, errors.New("engineer not found and not deleted")
}

// functions to delete resources from other resources//
func deleteEngineerFrom_Op(op_id string, engineer_id string) (bool, error) {

	_, err := findEngineer_by_Id(engineer_id)
	if err != nil {
		return false, errors.New(" Engineer doesn't exist ")
	}
	op_val, err := findOp_by_Id(op_id)
	if err != nil {
		return false, errors.New(" Operations group doesn't exist ")
	}
	_, err = findEngineerInOp_by_Id(op_val, engineer_id)
	if err != nil {
		return false, errors.New(" Engineer doesn't exists inside specified Operations group ")
	}

	// Remove engineer from operation using store method
	err = opsStore.RemoveEngineerFromOp(op_id, engineer_id)
	if err != nil {
		return false, errors.New(" Error: " + err.Error())
	}

	// Also remove from devops operations
	devOpsStore.RemoveEngineerFromAll(engineer_id)

	return true, nil

}

func deleteEngineerFrom_Dev(dev_id string, engineer_id string) (bool, error) {

	_, err := findEngineer_by_Id(engineer_id)
	if err != nil {
		return false, errors.New(" Engineer doesn't exist ")
	}
	dev_val, err := findDev_by_Id(dev_id)
	if err != nil {
		return false, errors.New(" Developer group doesn't exist ")
	}
	_, err = findEngineerInDev_by_Id(dev_val, engineer_id)
	if err != nil {
		return false, errors.New(" Engineer doesn't exists inside specified Developer group ")
	}

	// Remove engineer from dev using store method
	err = devStore.RemoveEngineerFromDev(dev_id, engineer_id)
	if err != nil {
		return false, errors.New(" Error: " + err.Error())
	}

	// Also remove from devops devs
	devOpsStore.RemoveEngineerFromAll(engineer_id)

	return true, nil

}

func deleteDevFrom_DevOps(devops_id string, dev_id string) (bool, error) {

	_, err := findDev_by_Id(dev_id)
	if err != nil {
		return false, errors.New(" Developer group doesn't exist ")
	}
	devops_val, err := findDevOps_by_Id(devops_id)
	if err != nil {
		return false, errors.New(" Developer Operations group doesn't exist ")
	}
	_, err = findDevInDevOps_by_Id(devops_val, dev_id)
	if err != nil {
		return false, errors.New(" Developer doesn't exists inside specified Developer Operations group ")
	}

	// Remove dev from devops using store method
	err = devOpsStore.RemoveDevFromDevOps(devops_id, dev_id)
	if err != nil {
		return false, errors.New(" Error: " + err.Error())
	}

	return true, nil

}

func deleteOpFrom_DevOps(devops_id string, op_id string) (bool, error) {

	_, err := findOp_by_Id(op_id)
	if err != nil {
		return false, errors.New(" Operations group doesn't exist ")
	}
	devops_val, err := findDevOps_by_Id(devops_id)
	if err != nil {
		return false, errors.New(" Developer Operations group doesn't exist ")
	}
	_, err = findOpInDevOps_by_Id(devops_val, op_id)
	if err != nil {
		return false, errors.New(" Operations group doesn't exists inside specified Developer Operations group ")
	}

	// Remove ops from devops using store method
	err = devOpsStore.RemoveOpsFromDevOps(devops_id, op_id)
	if err != nil {
		return false, errors.New(" Error: " + err.Error())
	}

	return true, nil

}

// **************************************************//
// functions to delete resources//
func deleteDevOps(devops_id string) (bool, error) {
	_, err := findDevOps_by_Id(devops_id)
	if err != nil {
		return false, errors.New(" Developer Operations group doesn't exist ")
	}

	// Remove devops from main store
	if !devOpsStore.DeleteByID(devops_id) {
		return false, errors.New(" Error: devops not found in store ")
	}

	return true, nil
}

func deleteDev(dev_id string) (bool, error) {
	_, err := findDev_by_Id(dev_id)
	if err != nil {
		return false, errors.New(" Developer group doesn't exist ")
	}

	// Remove dev from all devops
	for _, devops := range devOpsStore.List() {
		devOpsStore.RemoveDevFromDevOps(devops.Id, dev_id)
	}

	// Remove dev from main store
	if !devStore.DeleteByID(dev_id) {
		return false, errors.New(" Error: dev not found in store ")
	}

	return true, nil
}

func deleteOp(op_id string) (bool, error) {
	_, err := findOp_by_Id(op_id)
	if err != nil {
		return false, errors.New(" Operations group doesn't exist ")
	}

	// Remove ops from all devops
	for _, devops := range devOpsStore.List() {
		devOpsStore.RemoveOpsFromDevOps(devops.Id, op_id)
	}

	// Remove ops from main store
	if !opsStore.DeleteByID(op_id) {
		return false, errors.New(" Error: ops not found in store ")
	}

	return true, nil
}

func deleteEngineer(engineer_id string) (bool, error) {
	_, err := findEngineer_by_Id(engineer_id)
	if err != nil {
		return false, errors.New(" Engineer doesn't exist ")
	}

	// Remove engineer from all devs
	for _, dev := range devStore.List() {
		devStore.RemoveEngineerFromDev(dev.Id, engineer_id)
	}

	// Remove engineer from all ops
	for _, op := range opsStore.List() {
		opsStore.RemoveEngineerFromOp(op.Id, engineer_id)
	}

	// Remove engineer from all devops
	devOpsStore.RemoveEngineerFromAll(engineer_id)

	// Remove engineer from main store
	if !engineerStore.DeleteByID(engineer_id) {
		return false, errors.New(" Error: engineer not found in store ")
	}

	return true, nil
}

// server DELETE handler
func deleteRequestEngineer(c *gin.Context) {
	id := c.Param("id")
	_, err := deleteEngineer(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "engineer resource deleted"})
}

func deleteRequestDev(c *gin.Context) {
	id := c.Param("id")
	_, err := deleteDev(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "developer resource deleted"})
}

func deleteRequestOp(c *gin.Context) {
	id := c.Param("id")
	_, err := deleteOp(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "operations resource deleted"})
}

func deleteRequestDevOps(c *gin.Context) {
	id := c.Param("id")
	_, err := deleteDevOps(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "developer operations resource deleted"})
}
